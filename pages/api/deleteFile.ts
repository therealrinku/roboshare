import { NextApiRequest, NextApiResponse } from "next";
import db from "../../db";

type Data = {
  success: boolean;
  fileName?: string;
  fileLocation?: string;
  message?: string;
  fileId?: string;
};

export default function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
  const { fileUrl } = request.body;

  try {
    const query = `DELETE FROM files WHERE file_location='${fileUrl}'`;
    db.query(query).then((res) => response.status(200).json({ success: true }));
  } catch (err: any) {
    response.status(200).json({ success: false, message: err.message });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
