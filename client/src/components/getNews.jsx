import React, { useEffect, useState } from "react";
import axios from "axios";
import './GetNews.css'

const GetNews = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const getHeadlinesByQuery = async (query) => {
      try {
        const res = await axios.get("https://newsapi.org/v2/everything/", {
          params: {
            country: "il",
            q: query,
            from: "2023-09-27",
            apiKey: "ee48ee45aad34ceda527c50bfb6d29f2",
          },
        });

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

      for (const query of queries) {
        await getHeadlinesByQuery(query);
      }
    };

    getNewsByQueries();
  }, []);

  return (
    <>
      <br />
      <br />
      <div>Breaking News</div>
      <br />
      <div>
        {newsData.map((article) => (
          <div key={article.id}>
            <div className="headlineContainer">
              <div className="siteName">{article.author}</div>
              <br />
              <div className="headlines">{article.title}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetNews;
