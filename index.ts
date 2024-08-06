import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req: Request, res: Response) => {
  fs.readdir(`./files`, (err, files) => {
    // console.log(files);
    res.render("index.ejs", { files: files });
  });
});

app.get("/file/:fileName", (req: Request, res: Response) => {
  fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err, fileData) => {
    res.render("showTask.ejs", {
      fileName: req.params.fileName,
      fileData: fileData,
    });
  });
});
app.get("/edit/:fileName", (req: Request, res: Response) => {
  res.render("edit.ejs", { fileName: req.params.fileName });
});
app.post("/edit", (req: Request, res: Response) => {
  const previousName = req.body.previousName;
  const newName = req.body.newName.split(" ").join("");

  const previousFilePath = path.join(__dirname, "files", previousName);
  const newFilePath = path.join(__dirname, "files", newName);

  fs.rename(previousFilePath, newFilePath, (err) => {
    if (err) {
      console.error("Error renaming file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("File name change done");
    res.redirect("/");
  });
});

app.post("/create", (req: Request, res: Response) => {
  // console.log(req.body);
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    (err) => {}
  );
  res.redirect("/");
});

const port = 3000;

app.listen(port, () => {
  console.log(`App is running on ${port} port`);
});
