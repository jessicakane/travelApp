import React, { useEffect, useState } from "react";
import axios from "axios";
import './GetNews.css'

// require('dotenv').config();

const GetNews = () => {


  const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const translateText = async (text) => { 
          const api_key = process.env.REACT_APP_OPEN_AI_KEY;
          const requestData = {
            prompt: `Translate the following Hebrew text to English: '${text}'`,
            max_tokens: 50,
            temperature: 0.7,
          };
    
          try {
            const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', requestData, {
              headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
              },
            });
            
            const translatedText = response.data.choices[0].text.trim();
            return translatedText;
          } catch (error) {
            console.error(error);
            return null;
          }
        };

    const getHeadlinesByQuery = async (query) => {
      try {
        const res = await axios.get("https://newsapi.org/v2/top-headlines/", {
          params: {
            country: "il",
            q: query,
            from: new Date().toISOString().split('T')[0],
            apiKey: process.env.REACT_APP_NEWS_API_KEY_NEW,
            pageSize: "3",
          },
        });

        if (res.data) {
          const translatedArticles = await Promise.all(res.data.articles.map(async (article) => {
            const translatedTitle = await translateText(article.title);
            return { ...article, title: translatedTitle };
          }));

          setNewsData((prevData) => [...prevData, ...translatedArticles]);
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
              {/* <div className="siteName">{article.author}</div> */}
              {/* <br /> */}
              <div className="headlines">{article.title}</div>
              {console.log(article.title)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GetNews;
