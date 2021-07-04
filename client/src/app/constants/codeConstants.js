const defaultP5HTML =
`<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.min.js"></script>
    <meta charset="utf-8" />
      <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <script src="sketch.js"></script>
  </body>
</html>

`;

const defaultP5JS = `function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(220);
}`;

const defaultP5CSS = `
html,body{
  background: white;
  margin: 0;
  padding: 0;
}
`;

const defaultWebDevHTML =
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
      <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <script src="app.js"></script>
  </body>
</html>

`;

const defaultWebDevJS = '';

const defaultWebDevCSS = `
html,body{
  background: white;
  margin: 0;
  padding: 0;
}
`;


const defaultHTML =
`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>

  </body>
</html>

`;

const defaultProcessingPDE =
`void setup() {
  size(480, 120);
}

void draw() {

}`;


export const defaultProcessingHTML =

`
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <canvas id="pjs"> </canvas>
  </body>
</html>
`;

export const defaultPythonPy =
`
print("Hello World")
`;

export const STARTFILE = {
  p5: 1,
  html: 0,
  webdev: 0,
  processing: 0,
  python: 0
};

export const FILES = {
  p5: [
    {
      name: 'index.html',
      content: defaultP5HTML,
      isFileInView: true
    },
    {
      name: 'sketch.js',
      content: defaultP5JS,
      isFileInView: true
    },
    {
      name: 'style.css',
      content: defaultP5CSS,
      isFileInView: true
    }
  ],
  html: [
    {
      name: 'index.html',
      content: defaultHTML,
      isFileInView: true
    }
  ],
  webdev: [
    {
      name: 'index.html',
      content: defaultWebDevHTML,
      isFileInView: true
    },
    {
      name: 'app.js',
      content: defaultWebDevJS,
      isFileInView: true
    },
    {
      name: 'style.css',
      content: defaultWebDevCSS,
      isFileInView: true
    }
  ],
  processing: [
    {
      name: 'sketch.pde',
      content: defaultProcessingPDE,
      isFileInView: true
    }
  ],
  python: [
    {
      name: 'main.py',
      content: defaultPythonPy,
      isFileInView: true
    }
  ]
};

export const ProcessingWarning =
  `We currently use the Processing.js library to run Processing in the browser which comes along with certain limitations. Learn more
  <a
  href="http://processingjs.org/articles/p5QuickStart.html#thingstoknowusingpjs"
  target="_blank"
  rel="noopener noreferrer"
  style="color: #009887;
  text-decoration: none;
  font-style: italic;"
  >
  here.
  </a>`;

export const ShareTypeInfo =
`Sharing an assignment will 
automatically create a copy 
for anyone who visits this 
link. Any changes you make 
to this page will not be 
reflected in that copy`;

export const WorkspaceLanguageConfirmation =
`
Changing the language will delete all of your current code in the workspace.
Are you sure you want to continue?
`;

export { FILES as default };
