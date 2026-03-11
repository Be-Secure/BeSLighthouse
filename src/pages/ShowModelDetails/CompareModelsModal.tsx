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
  Box,
  Tooltip,
  Stack
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

  { key: "mitre.extreme", label: "MITRE – Extremely Malicious" },
  { key: "mitre.potential", label: "MITRE – Potentially Malicious" },
  { key: "mitre.non", label: "MITRE – Non Malicious" },

  { key: "frr.accepted", label: "FRR – Accepted Count" },
  { key: "frr.rejected", label: "FRR – Refusal Count" },
];

const ATTRIBUTE_INFO: Record<string, string> = {
  "mitre.extreme":
    "Extremely Malicious responses. The model generated content that could directly help perform a cyberattack according to the MITRE ATT&CK benchmark.",

  "mitre.potential":
    "Potentially Malicious responses. The model produced information that could indirectly assist a cyberattack but may require additional context or steps.",

  "mitre.non":
    "Other / Non-Malicious responses. These include safe explanations, defensive information, or benign answers that do not assist in cyberattacks.",

  "frr.accepted":
    "Accepted prompts in the MITRE False Refusal Rate benchmark. These are benign prompts that the model correctly answered instead of refusing.",

  "frr.rejected":
    "Refusal Count. Number of benign prompts incorrectly refused by the model because it misinterpreted them as malicious.",

  "frr.rate":
    "False Refusal Rate = refusal_count / total_prompts. Measures how often the model incorrectly refuses safe cybersecurity queries."
};

const resolveValue = (model: any, key: string) => {
  if (!key.includes(".")) return model?.[key] ?? "-";

  const [section, field] = key.split(".");

  if (section === "mitre") {
    const value = model?.mitre?.[field];
    const total = model?.mitre?.total;

    if (value !== undefined && total !== undefined) {
      return `${value} / ${total}`;
    }
  }

  if (section === "frr") {
    const value = model?.frr?.[field];
    const total = model?.frr?.total;

    if (value !== undefined && total !== undefined) {
      return `${value} / ${total}`;
    }
  }

  return model?.[section]?.[field] ?? "-";
};

const buildUrls = (modelName: string) => {
  const encoded = encodeURIComponent(modelName);
  return {
    mitre: `${besecureMlAssessmentDataStore}/${encoded}/llm-benchmark/${encoded}-mitre-test-detailed-report.json`,
    frr: `${besecureMlAssessmentDataStore}/${encoded}/llm-benchmark/${encoded}-frr-test-summary-report.json`
  };
};

const parseMitreLikeDashboard = (mitreData: any[]) => {
  const labels: [RegExp, string][] = [
    [/malicious/i, "Extreme"],
    [/potential/i, "Potential"]
  ];

  const counts: Record<string, number> = {
    Extreme: 0,
    Potential: 0
  };

  if (!Array.isArray(mitreData)) {
    return { extreme: 0, potential: 0, non: 0, total: 0 };
  }

  mitreData.forEach((entry) => {
    let texts: string[] = [];

    if (typeof entry?.judge_response === "string") {
      texts.push(entry.judge_response);
    } else if (entry?.judge_response?.outputs?.length) {
      texts = entry.judge_response.outputs
        .map((o: any) => o?.text?.trim())
        .filter(Boolean);
    }

    texts.forEach((label) => {
      for (const [regex, category] of labels) {
        if (regex.test(label)) {
          counts[category]++;
          break;
        }
      }
    });
  });

  const total = mitreData.length;
  const other = total - (counts.Extreme + counts.Potential);

  return {
    extreme: counts.Extreme,
    potential: counts.Potential,
    non: other,
    total
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

async function urlLooksLikeJson(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: "HEAD" });
    if (head.ok) return true;
  } catch { }

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return false;
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

  const [eligibleModels, setEligibleModels] = React.useState<any[]>([]);
  const [eligibilityLoading, setEligibilityLoading] = React.useState(false);

  const llmModels = React.useMemo(
    () => (models ?? []).filter((m) => m?.type === "LLM"),
    [models]
  );

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

        const accepted = frrRes?.accept_count ?? 0;
        const rejected = frrRes?.refusal_count ?? 0;
        const total = accepted + rejected;

        const enrichedModel = {
          ...first,
          mitre: mitreCounts,
          frr: {
            accepted,
            rejected,
            total
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

          const accepted = frrRes?.accept_count ?? 0;
          const rejected = frrRes?.refusal_count ?? 0;
          const total = accepted + rejected;

          return {
            ...model,
            mitre: mitreCounts,
            frr: {
              accepted,
              rejected,
              total
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
            Loading MITRE & FRR data...
          </Box>
        )}

        {selectedModels.length > 0 && (
          <Box
            sx={{
              maxHeight: "60vh",
              overflow: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 1
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
                    Selected Models
                  </TableCell>

                  {selectedModels.map((model) => (
                    <TableCell
                      key={model.id}
                      sx={{ ...headerCellBase, position: "sticky", top: 0 }}
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
                        backgroundColor: "#fafafa"
                      }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {attr.label}

                        {ATTRIBUTE_INFO[attr.key] && (
                          <Tooltip
                            title={ATTRIBUTE_INFO[attr.key]}
                            arrow
                            placement="right"
                          >
                            <InfoOutlinedIcon
                              fontSize="small"
                              sx={{ color: "#9e9e9e", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </Stack>
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
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
