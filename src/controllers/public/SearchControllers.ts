import {
  getSearchProdcutModal,
  getSearchProductModalByPage,
} from "../../models/public/SearchModal";

export const getSearchContoller = async (req: any, res: any) => {
  const { searchQuery } = req.query;

  console.log(searchQuery);

  try {
    const data = await getSearchProdcutModal(searchQuery);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const getSearchByPageContoller = async (req: any, res: any) => {
  const { searchQuery, limit, page, lastDoc } = req.query;
  console.log(searchQuery, limit, page);
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 40;
  console.log(searchQuery);

  try {
    const data = await getSearchProductModalByPage(
      searchQuery,
      pageNumber,
      limitNumber,
      lastDoc
    );
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
