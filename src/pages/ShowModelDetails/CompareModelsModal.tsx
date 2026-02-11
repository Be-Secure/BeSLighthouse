import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Box
} from "@mui/material";
import { besecureMlAssessmentDataStore } from "../../dataStore";

const MAX_COMPARE = 3;
const ATTRIBUTE_COL_WIDTH = 240;
const MODEL_COL_WIDTH = 220;

const HEADER_PADDING_Y = "16px";
const BODY_PADDING_Y = "8px";

const ATTRIBUTES = [
  { key: "organization", label: "Organization" },
  { key: "type", label: "Type" },
  { key: "size", label: "Model Size" },
  { key: "license", label: "License" },
  { key: "access", label: "Access" },
  { key: "created_date", label: "Created Date" },

  { key: "mitre.extreme", label: "MITRE – Extremely Malicious" },
  { key: "mitre.potential", label: "MITRE – Potentially Malicious" },
  { key: "mitre.non", label: "MITRE – other" },

  { key: "frr.accepted", label: "FRR – Accepted" },
  { key: "frr.rejected", label: "FRR – Refusal Count" },
  { key: "frr.rate", label: "FRR – Refusal Rate" }
];

const resolveValue = (model: any, key: string) => {
  if (!key.includes(".")) return model?.[key] ?? "-";
  const [section, field] = key.split(".");
  return model?.[section]?.[field] ?? "-";
};

const buildUrls = (modelName: string) => {
  const encoded = encodeURIComponent(modelName);
  return {
    mitre: `${besecureMlAssessmentDataStore}/${encoded}/llm-benchmark/${encoded}-mitre-test-detailed-report.json`,
    frr: `${besecureMlAssessmentDataStore}/${encoded}/llm-benchmark/${encoded}-frr-test-summary-report.json`
  };
};

/*
 SAME LOGIC AS SummaryDashboard.generateData()
 Malicious   -> Extremely Malicious
 Potential   -> Potentially Malicious
 Other       -> Non Malicious
*/
const parseMitreLikeDashboard = (mitreData: any[]) => {
  let malicious = 0;
  let potential = 0;

  if (!Array.isArray(mitreData)) {
    return { extreme: 0, potential: 0, non: 0 };
  }

  mitreData.forEach((entry) => {
    entry?.judge_response?.outputs?.forEach((out: any) => {
      const text = out?.text?.trim() || "";

      if (/malicious/i.test(text)) {
        malicious++;
      } else if (/potential/i.test(text)) {
        potential++;
      }
    });
  });

  const other = mitreData.length - (malicious + potential);

  return {
    extreme: malicious,
    potential: potential,
    non: other
  };
};

interface Props {
  open: boolean;
  onClose: () => void;
  models: any[];
}

const headerCellBase = {
  padding: `${HEADER_PADDING_Y} 12px`,
  fontWeight: 600,
  backgroundColor: "#fafafa",
  borderRight: "1px solid #e0e0e0",
  borderBottom: "1px solid #e0e0e0",
  verticalAlign: "middle",
  whiteSpace: "nowrap"
};

const bodyCellBase = {
  padding: `${BODY_PADDING_Y} 12px`,
  borderRight: "1px solid #e0e0e0",
  borderBottom: "1px solid #e0e0e0",
  verticalAlign: "middle"
};

/** Try HEAD first, fallback to GET if HEAD is blocked by server/CORS. */
async function urlLooksLikeJson(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: "HEAD" });
    if (head.ok) return true;
  } catch {
    // ignore and fallback to GET
  }

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return false;
    // Validate it is actually JSON (and not an HTML error page).
    await res.clone().json();
    return true;
  } catch {
    return false;
  }
}

async function hasBothReports(modelName: string): Promise<boolean> {
  const urls = buildUrls(modelName);
  const [mitreOk, frrOk] = await Promise.all([
    urlLooksLikeJson(urls.mitre),
    urlLooksLikeJson(urls.frr)
  ]);
  return mitreOk && frrOk;
}

export default function CompareModelsModal({ open, onClose, models }: Props) {
  const [selectedModels, setSelectedModels] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // NEW: only models that have BOTH files
  const [eligibleModels, setEligibleModels] = React.useState<any[]>([]);
  const [eligibilityLoading, setEligibilityLoading] = React.useState(false);

  const llmModels = React.useMemo(
    () => (models ?? []).filter((m) => m?.type === "LLM"),
    [models]
  );

  // NEW: compute eligible list on open
  React.useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const run = async () => {
      setEligibilityLoading(true);
      try {
        const checks = await Promise.all(
          llmModels.map(async (m) => {
            const ok = await hasBothReports(m.name);
            return ok ? m : null;
          })
        );

        const eligible = checks.filter(Boolean) as any[];
        if (!cancelled) setEligibleModels(eligible);
      } catch (e) {
        console.error("Eligibility check failed", e);
        if (!cancelled) setEligibleModels([]);
      } finally {
        if (!cancelled) setEligibilityLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [open, llmModels]);

  // UPDATED: default load uses first eligible model
  React.useEffect(() => {
    if (!open) return;
    if (!eligibleModels.length) {
      setSelectedModels([]);
      return;
    }

    let cancelled = false;

    const loadDefault = async () => {
      const first = eligibleModels[0];
      setLoading(true);

      try {
        const urls = buildUrls(first.name);

        const [mitreRes, frrRes] = await Promise.all([
          fetch(urls.mitre).then((r) => r.json()),
          fetch(urls.frr).then((r) => r.json())
        ]);

        const mitreCounts = parseMitreLikeDashboard(mitreRes);

        const enrichedModel = {
          ...first,
          mitre: mitreCounts,
          frr: {
            accepted: frrRes?.accept_count ?? 0,
            rejected: frrRes?.refusal_count ?? 0,
            rate: frrRes?.refusal_rate ?? 0
          }
        };

        if (!cancelled) setSelectedModels([enrichedModel]);
      } catch (err) {
        console.error("Compare default load failed", err);
        if (!cancelled) setSelectedModels([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDefault();

    return () => {
      cancelled = true;
    };
  }, [open, eligibleModels]);

  const handleChange = async (_: any, value: any[]) => {
    const unique = Array.from(new Map(value.map((m) => [m.id, m])).values());
    if (unique.length > MAX_COMPARE) return;

    setLoading(true);

    try {
      const enriched = await Promise.all(
        unique.map(async (model) => {
          const urls = buildUrls(model.name);

          const [mitreRes, frrRes] = await Promise.all([
            fetch(urls.mitre).then((r) => r.json()),
            fetch(urls.frr).then((r) => r.json())
          ]);

          const mitreCounts = parseMitreLikeDashboard(mitreRes);

          return {
            ...model,
            mitre: mitreCounts,
            frr: {
              accepted: frrRes?.accept_count ?? 0,
              rejected: frrRes?.refusal_count ?? 0,
              rate: frrRes?.refusal_rate ?? 0
            }
          };
        })
      );

      setSelectedModels(enriched);
    } catch (err) {
      console.error("Compare fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="body">
      <DialogTitle sx={{ fontWeight: 600 }}>Compare Models</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Autocomplete
          multiple
          options={eligibleModels}
          value={selectedModels}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(o: any) => o.name}
          onChange={handleChange}
          disableCloseOnSelect
          disabled={eligibilityLoading}
          loading={eligibilityLoading}
          renderTags={(value, getTagProps) =>
            value.map((o: any, i: number) => (
              <Chip
                label={o.name}
                {...getTagProps({ index: i })}
                key={o.id}
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                eligibilityLoading
                  ? "Checking available reports..."
                  : "Select up to 3 LLM models"
              }
              size="small"
            />
          )}
          sx={{ mb: 3 }}
        />

        {(eligibilityLoading || loading) && (
          <Box textAlign="center" py={2}>
            Loading MITRE &amp; FRR data...
          </Box>
        )}

        {selectedModels.length > 0 && (
          <Box
            sx={{
              maxHeight: "60vh",
              overflow: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              scrollbarGutter: "stable"
            }}
          >
            <Table stickyHeader size="small" sx={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: ATTRIBUTE_COL_WIDTH }} />
                {selectedModels.map((model) => (
                  <col key={model.id} style={{ width: MODEL_COL_WIDTH }} />
                ))}
              </colgroup>

              <TableHead
                sx={{
                  display: "table-header-group",
                  "& .MuiTableCell-root": {
                    paddingTop: "16px",
                    paddingBottom: "16px"
                  }
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      ...headerCellBase,
                      position: "sticky",
                      left: 0,
                      top: 0,
                      zIndex: 4
                    }}
                  >
                    Attribute
                  </TableCell>

                  {selectedModels.map((model) => (
                    <TableCell
                      key={model.id}
                      sx={{
                        ...headerCellBase,
                        position: "sticky",
                        top: 0,
                        zIndex: 3
                      }}
                    >
                      {model.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {ATTRIBUTES.map((attr) => (
                  <TableRow key={attr.key}>
                    <TableCell
                      sx={{
                        ...bodyCellBase,
                        fontWeight: 500,
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#fafafa",
                        zIndex: 2
                      }}
                    >
                      {attr.label}
                    </TableCell>

                    {selectedModels.map((model) => (
                      <TableCell
                        key={`${model.id}-${attr.key}`}
                        sx={bodyCellBase}
                      >
                        {resolveValue(model, attr.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {!eligibilityLoading && eligibleModels.length === 0 && (
          <Box textAlign="center" py={2}>
            No LLM models found with both MITRE and FRR reports.
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={onClose}
          sx={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 600,
            mr: 1,
            "&:hover": {
              backgroundColor: "#1565c0"
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
