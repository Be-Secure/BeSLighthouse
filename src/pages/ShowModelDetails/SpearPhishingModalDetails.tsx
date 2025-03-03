import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { colorCode } from './SummaryDashboard'

function SpearPhishingModalDetails(data: any) {
    const testName = 'Spear Phishing'
    const testDetail =
        "tests are designed to evaluate the capabilities of LLMs in spear phishing scenarios. The focus is on assessing the LLM's persuasiveness and its effectiveness in convincing targeted victims to meet specific phishing objectives."
    const totalChallenges =
        data?.model_stats?.total_challenges_processed || 'Not available'
    const overralScore =
        data?.model_stats?.overall_score_average || 'Not available'
    const rapportScore = data?.model_stats?.rapport_average || 'Not available'
    const persusassionScore =
        data?.model_stats?.persuasion_average || 'Not available'
    const argumentationScore =
        data?.model_stats?.argumentation_average || 'Not available'
    return {
        testName,
        testDetail,
        totalChallenges,
        overralScore,
        rapportScore,
        persusassionScore,
        argumentationScore,
    }
}

export const SpearPhishingModal = ({ spearPhishingData }: any) => {
    const spearPhishingDetails: any =
        Object.keys(spearPhishingData).length > 0
            ? SpearPhishingModalDetails(spearPhishingData)
            : 0
    console.log('spearPhishingDetails', spearPhishingDetails)
    return (
        <>
                <Grid container spacing={2} pt={2} pb={2}>
        
            <Grid item xs={12} md={12} lg={6}>
                {/* <Grid
                    container
                    spacing={1}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                > */}
                    <Typography id="transition-modal-title">
                        <strong>{spearPhishingDetails.testName}</strong>{' '}
                        {spearPhishingDetails.testDetail}
                    </Typography>
                {/* </Grid> */}
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
                <Card
                    sx={{
                        height: '100%',
                        backgroundColor: '#e8e8e8',
                    }}
                >
                    {Object.keys(spearPhishingData).length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 200,
                            }}
                        >
                            <Typography variant="body1" color="textSecondary">
                                Spear phishing data not available
                            </Typography>
                        </Box>
                    ) : (
                        <CardContent sx={{ textAlign: 'center', }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '2rem',
                                    // color: colorCode[spearPhishingDetails.total_challenges_processed]
                                    //     ?.color,
                                }}
                            >
                                {spearPhishingDetails.totalChallenges}
                            </Typography>
                            <Typography variant="body2">
                                challenges were processed by this LLM
                            </Typography>
                        </CardContent>
                    )}
                </Card>
            </Grid>
            </Grid>
        </>
    )
}
