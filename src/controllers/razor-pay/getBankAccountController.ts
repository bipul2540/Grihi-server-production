import axios from "axios";

export const getBankAccountController = async (req: any, res: any) => {
  const { userId } = req.user;

  if (!userId) return res.status(400).json({ message: "not authorized" });
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const encodedKey = Buffer.from(`${keyId}:`).toString("base64");
    if (!keyId) return res.status(500).json({ message: "no keys found" });
    const response = await axios({
      method: "GET",
      url: "https://api.razorpay.com/v1/methods",
      headers: {
        Authorization: `Basic ${encodedKey}`, // Properly encode the keyId in Basic Auth
        "Content-Type": "application/json",
      },
    });

    const netBankingBanks = response.data.netbanking;
    res.status(200).json(netBankingBanks);
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({ message: "Error fetching banks" });
  }
};
