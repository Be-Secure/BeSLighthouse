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

/* ===================== CONSTANTS ===================== */

const MAX_COMPARE = 3;
const ATTRIBUTE_COL_WIDTH = 240;
const MODEL_COL_WIDTH = 220;

/* Header row is taller ONLY via padding */
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

/* ===================== HELPERS ===================== */

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

/* ===================== PROPS ===================== */

interface Props {
  open: boolean;
  onClose: () => void;
  models: any[];
}

/* ===================== CELL STYLES ===================== */

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

/* ===================== COMPONENT ===================== */

export default function CompareModelsModal({
  open,
  onClose,
  models
}: Props) {

  const [selectedModels, setSelectedModels] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  /* ===== LOAD DEFAULT MODEL ===== */

  React.useEffect(() => {
    if (!open || !models?.length) return;

    const loadDefault = async () => {

      const firstModel = models[0];
      setLoading(true);

      try {

        const urls = buildUrls(firstModel.name);

        const [mitreRes, frrRes] = await Promise.all([
          fetch(urls.mitre).then(r => r.json()),
          fetch(urls.frr).then(r => r.json())
        ]);

        const mitreCounts = parseMitreLikeDashboard(mitreRes);

        const enrichedModel = {
          ...firstModel,
          mitre: mitreCounts,
          frr: {
            accepted: frrRes?.accept_count ?? 0,
            rejected: frrRes?.refusal_count ?? 0,
            rate: frrRes?.refusal_rate ?? 0
          }
        };

        setSelectedModels([enrichedModel]);

      } catch (err) {
        console.error("Compare default load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDefault();

  }, [open, models]);

  /* ===== ON MODEL SELECTION ===== */

  const handleChange = async (_: any, value: any[]) => {

    if (value.length > MAX_COMPARE) return;

    setLoading(true);

    try {

      const enriched = await Promise.all(
        value.map(async (model) => {

          const urls = buildUrls(model.name);

          const [mitreRes, frrRes] = await Promise.all([
            fetch(urls.mitre).then(r => r.json()),
            fetch(urls.frr).then(r => r.json())
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

  /* ===================== UI ===================== */

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="body">

      <DialogTitle sx={{ fontWeight: 600 }}>
        Compare Models
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>

        {/* ===== MODEL SELECTOR ===== */}

        <Autocomplete
          multiple
          options={models}
          value={selectedModels}
          getOptionLabel={(o: any) => o.name}
          onChange={handleChange}
          disableCloseOnSelect
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
              placeholder="Select up to 3 models"
              size="small"
            />
          )}
          sx={{ mb: 3 }}
        />

        {loading && (
          <Box textAlign="center" py={2}>
            Loading MITRE & FRR data...
          </Box>
        )}

        {/* ===== TABLE ===== */}

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

              <TableHead sx={{ display: "table-header-group", "& .MuiTableCell-root": { paddingTop: "16px", paddingBottom: "16px" } }} >
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
                      <TableCell key={model.id} sx={bodyCellBase}>
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
