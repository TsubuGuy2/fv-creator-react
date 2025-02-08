import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { productName, features, price, differentiation, age, gender, painPoints, motivation } = req.body;

  const prompt = `
  【入力データ】
  - 商品名: ${productName}
  - 特徴: ${features}
  - 価格: ${price}
  - 競合との差別化: ${differentiation}
  - ターゲット: ${age}歳 / ${gender}
  - ユーザーの悩み: ${painPoints}
  - 購買動機: ${motivation}

  【タスク】
  - ヘッドコピー（12文字×4行）
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
  });

  res.status(200).json({ headline: response.choices[0]?.message?.content || "エラーが発生しました" });
}
