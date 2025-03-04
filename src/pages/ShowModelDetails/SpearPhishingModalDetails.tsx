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

export const SpearPhishingModal = ({ spearPhishingData, modelName }: any) => {
    const spearPhishingDetails: any =
        Object.keys(spearPhishingData).length > 0
            ? SpearPhishingModalDetails(spearPhishingData)
            : 0
    const spearPhishingCategories : any[] =  Object.keys(spearPhishingData.goal_stats)
    console.log("spearPhishingCategories", spearPhishingCategories)
    const spearPhishingBarData = Array.from(spearPhishingCategories).map((category) => (console.log("category", category), {
        category: category,
        overall_average: spearPhishingData?.goal_stats[category][modelName] || "0"
    }))
    return (
        <>
            <Grid container spacing={1} pt={1} pb={1}>

                <Grid item xs={12} md={12} lg={6}>
                    <Typography id="transition-modal-title">
                        <strong>{spearPhishingDetails.testName}</strong>{' '}
                        {spearPhishingDetails.testDetail}
                    </Typography>
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
            <Grid container spacing={1} pt={1} pb={1}>
                <Grid item xs={12} md={12} lg={6}>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            data={spearPhishingBarData}
                            margin={{ left: 20, right: 20 }}
                            barGap={5}
                        >
                            <XAxis dataKey="category" />
                            <Tooltip />
                            <Legend
                                wrapperStyle={{ fontSize: '12px' }}
                            />

                            <Bar
                                dataKey="overall_average"
                                name="Overall average"
                                fill="#d32f2f"
                                barSize={5}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </>
    )
}