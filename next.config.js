/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'schedule4me.s3.amazonaws.com'
        ]
    },
    env: {
        S3URL: "https://schedule4me.s3.amazonaws.com/"
    }
}

module.exports = nextConfig
