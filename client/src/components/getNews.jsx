import React, { useEffect, useState } from "react";
import axios from "axios";
import './GetNews.css'

const GetNews = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const getHeadlinesByQuery = async (query) => {
      try {
        const res = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            // country: "us",
            q: query,
            // from: new Date().toISOString().split('T')[0],
            // to: new Date().toISOString().split('T')[0],
            apiKey: "ee48ee45aad34ceda527c50bfb6d29f2",
            // language: 'en',
            sources: 'Israel-National-News',
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
      //query keywords in hebrew, but headlines should display in english

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
