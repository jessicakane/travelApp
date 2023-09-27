import React, { useEffect, useState } from "react";
import axios from "axios";

const GetNews = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const getHeadlinesByQuery = async (query) => {
      try {
        const res = await axios.get(
          "https://newsapi.org/v2/top-headlines/",
          {
            params: {
              country: "il",
              q: query,
              from: "2023-09-27",
              apiKey: "ee48ee45aad34ceda527c50bfb6d29f2",
            },
          }
        );

        if (res.data) {
          console.log(res.data);
          setNewsData((prevData) => [...prevData, ...res.data.articles]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getNewsByQueries = async () => {
      const queries = [""];
      //query keywords in hebrew, but headlines should display in english

      for (const query of queries) {
        await getHeadlinesByQuery(query);
      }
    };

    getNewsByQueries();
  }, []);

  return (
    <>
      <div>Israeli News Sites</div>
      <br />
      <div>
        {newsData.map((article) => (
          <div key={article.id}>
            <div>{article.author}</div>
            <br />
            <div>{article.title}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetNews;
