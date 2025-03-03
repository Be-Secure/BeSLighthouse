export default function SpearPhishingModalDetails(data: any) {
    const testName = "Spear Phishing";
    const testDetail = " tests are designed to evaluate the capabilities of LLMs in spear phishing scenarios. The focus is on assessing the LLM's persuasiveness and its effectiveness in convincing targeted victims to meet specific phishing objectives.";
    const totalChallenges = data?.model_stats?.total_challenges_processed || "Not available";
    const overralScore = data?.model_stats?.overall_score_average || "Not available";
    const rapportScore = data?.model_stats?.rapport_average || "Not available";
    const persusassionScore = data?.model_stats?.persuasion_average || "Not available";
    const argumentationScore = data?.model_stats?.argumentation_average || "Not available";
    return({
        testName,
        testDetail,
        totalChallenges,
        overralScore,
        rapportScore,
        persusassionScore,
        argumentationScore,
    });
}