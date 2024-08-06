"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/", (req, res) => {
    fs_1.default.readdir(`./files`, (err, files) => {
        // console.log(files);
        res.render("index.ejs", { files: files });
    });
});
app.get("/file/:fileName", (req, res) => {
    fs_1.default.readFile(`./files/${req.params.fileName}`, "utf-8", (err, fileData) => {
        res.render("showTask.ejs", {
            fileName: req.params.fileName,
            fileData: fileData,
        });
    });
});
app.get("/edit/:fileName", (req, res) => {
    res.render("edit.ejs", { fileName: req.params.fileName });
});
app.post("/edit", (req, res) => {
    const previousName = req.body.previousName;
    const newName = req.body.newName.split(" ").join("");
    const previousFilePath = path_1.default.join(__dirname, "files", previousName);
    const newFilePath = path_1.default.join(__dirname, "files", newName);
    fs_1.default.rename(previousFilePath, newFilePath, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log("File name change done");
        res.redirect("/");
    });
});
app.post("/create", (req, res) => {
    // console.log(req.body);
    fs_1.default.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, req.body.details, (err) => { });
    res.redirect("/");
});
const port = 3000;
app.listen(port, () => {
    console.log(`App is running on ${port} port`);
});
