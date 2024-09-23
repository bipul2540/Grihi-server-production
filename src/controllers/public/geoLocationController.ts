import axios from "axios";

export const getAddressByPinCodeController = async (req: any, res: any) => {
  const { postalCode } = req.query;

  if (!postalCode) {
    return res.status(400).json({ error: "Postal code not found" });
  }

  const apiKey = process.env.LOCATION_IQ_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${postalCode}&format=json`;

  try {
    const response = await axios.get(url);
    const data: any = response.data;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    const displayName = data[0].display_name;
    const addressParts = displayName
      .split(",")
      .map((part: string) => part.trim());

    const addressObject = {
      city: addressParts[0],
      district: addressParts[1],
      state: addressParts[2],
      pincode: addressParts[3],
      country: addressParts[4],
    };

    res.status(200).json(addressObject);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location data" });
  }
};
