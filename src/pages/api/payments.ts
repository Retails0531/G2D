// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	name: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	const { orderId, paymentKey, amount } = req.query;
	const secretKey = process.env.TOSS_SECRET_KEY;

	const url = "https://api.tosspayments.com/v1/payments/confirm";
	const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

	await fetch(url, {
		method: "post",
		body: JSON.stringify({
			amount,
			orderId,
			paymentKey,
		}),
		headers: {
			Authorization: `Basic ${basicToken}`,
			"Content-Type": "application/json",
		},
	}).then((res) => res.json());

	// TODO: DB 처리
	res.redirect(`/payments/complete?orderId=${orderId}`);
}
