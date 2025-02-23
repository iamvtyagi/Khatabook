
const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended : true}))

require('dotenv').config()

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'serif'], // Define a custom font family
      },
    },
  },
};




app.get('/', function (req, res) {
  fs.readdir(`./files`,function(err,files){
      res.render('index',{files : files});
  })
})

// app.get('/create', function (req, res) {
  // const today = new Date();
  
  // let day = today.getDate();
  // let month = today.getMonth() + 1; // Months are zero-based, so we add 1
  // let year = today.getFullYear();
//   const fn = `${day}-${month}-${year}.txt`;
//   fs.writeFile(`./files/${fn}`,req.body.details,function(err){
//       if(err) return res.send("somthing went wrong")
//           else res.send("done");
//   })
// })

app.get('/create', function(req,res){
     res.render('create')
})

app.post('/create', function(req, res, next) {
    const today = new Date();
  
  let day = today.getDate();
  let month = today.getMonth() + 1; // Months are zero-based, so we add 1
  let year = today.getFullYear();
  const dateFilename = `${day}-${month}-${year}.txt`;
  fs.writeFile(`./files/${req.body.hisaabTitle.replace(/\s+/g,'-')}.txt`,req.body.hisaabContent,function(err){
         res.redirect("/")
  })
  // jo ye splite hai vo isko space ke basis par todke array bana dega phir un sabko join krdege ham
});

app.get('/edit/:filename', function (req, res) {
  const filePath = `./files/${req.params.filename}`;
  let displayFilename = req.params.filename.replace('.txt', '').replace(/-/g, ' ');

  fs.readFile(filePath, 'utf-8', function(err, filedata) {
      if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send("Error loading file for editing");
      }
      
      // Render the 'edit' page with both filename and file data
      res.render('edit', { filename: displayFilename, filedata: filedata });
  });
});


app.post('/edit/:filename', function(req, res) {
  // Get the filename and replace any spaces with dashes to match the saved file format
  const filename = req.params.filename.replace(/ /g, '-');

  // Append the new content to the specified file
  fs.writeFile(`./files/${filename}`, req.body.newHisabEdit , function(err) {
      if (err) {
          console.error("Error appending to file:", err);
          res.status(500).send("Error updating file");
      } else {
          res.redirect('/'); // Redirect after successful append
      }
  });
});



app.get('/show/:filename', function (req, res) {
  const rawFilename = req.params.filename;
  const filePath = `./files/${rawFilename}`;

  // Format filename for display (remove .txt and replace dashes with spaces)
  const displayFilename = rawFilename.replace('.txt', '').replace(/-/g, ' ');

  fs.readFile(filePath, 'utf-8', function(err, filedata) {
      if (err) {
          console.error("Error reading file:", err);
          return res.status(404).send("File not found");
      }

      // Render the show page with both filenames and the file content
      res.render('show', {
          filename: rawFilename,        // Original filename with .txt for linking
          filename1: displayFilename,   // Display-friendly filename without .txt and with spaces
          filedata: filedata            // File content to display
      });
  });
});



  // Route to handle form submission
// app.post('/create', (req, res) => {
//   const { hisaabTitle, hisaabContent } = req.body;

//   // Check if title or content is missing
//   if (!hisaabTitle || !hisaabContent) {
//     return res.status(400).send("Both title and content are required.");
//   }

//   // Create a filename using the title and save it in the 'files' folder
//   const fileName = `${hisaabTitle.replace(/\s+/g, '_')}.txt`;
//   const filePath = path.join(__dirname, 'files', fileName);

//   // Write the content to a new file
//   fs.writeFile(filePath, hisaabContent, (err) => {
//     if (err) {
//       return res.status(500).send("Failed to create the Hisaab file.");
//     }
//     res.redirect("/"); // Redirect to home or another route as needed
//   });
// });

  app.get('/delete/:filename', function (req, res) {
    fs.unlink(`./files/${req.params.filename}`, function (err) {
      if (err) return res.send(err);
      else res.redirect("/");
    });
  });

  let port = process.env.PORT || 4999;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

