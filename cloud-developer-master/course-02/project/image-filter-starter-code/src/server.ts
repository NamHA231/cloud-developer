import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  // http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg
  app.get("/filteredimage", async (req, res) => {
    console.log('req', req.query.image_url);
    // 1. validate the image_url query
    if (req.query.image_url) {
      // 2. call filterImageFromURL(image_url) to filter the image
      let imageUrl = req.query.image_url.toString();
      filterImageFromURL(imageUrl).then(response => {
        res.status(200).sendFile(response);
        // deleteLocalFiles([response]);
      },
        (err) => {
          res.status(400).send(`Filtered image from image_url=${req.query.image_url} is failed!`);
          console.log('err', err)
        }
      );
    } else {
      res.status(406).send("try GET /filteredimage?image_url={{}}, image_url is required!");
    }
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();