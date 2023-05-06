// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const apiUrl = process.env.NODE_ENV === 'development' ? process.env.API_URL : process.env.API_URL_PROD;
export default async function handler(req, res) {
  res.status(200).json({ data: apiUrl });
}
