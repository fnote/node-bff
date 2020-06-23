export default function getBatchAPIConfigs() {
    return  {
        api: {
            getInputSignedUrl: process.env.BATCH_API + '/v1/batch/files/sign-url/input',
            getOutputSignedUrl: process.env.BATCH_API + '/v1/batch/files/sign-url/output',
        },
    };
}