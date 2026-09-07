# Advanced PDF Annotations in React PDF Viewer Hosted on iPad
This sample demonstrates the advanced annotation capabilities of the Syncfusion PDF Viewer for React. Users can highlight text, create freehand ink annotations, and add shape annotations such as lines, rectangles, and circles to mark important content. It also supports Free Text annotations for adding comments directly to PDF documents and includes an Ink Eraser tool for removing unwanted ink strokes. These features provide an interactive PDF viewing, annotation, review, and collaboration experience on iPad and other devices.

## Features — PDF Annotation Tools

The Syncfusion PDF Viewer provides a comprehensive set of annotation tools that allow users to mark up and collaborate on PDF documents without modifying the original content.

| Annotation Type | Description |
|---|---|
| Text Markup | Highlight important text within the document. |
| Free Text | Add comments and notes directly onto PDF pages. |
| Ink Annotation | Draw freehand annotations using mouse, touch, or stylus input. |
| Ink Eraser | Remove unwanted freehand ink strokes with ease. |
| Line Annotation | Draw straight lines to connect or emphasize content. |
| Rectangle Annotation | Highlight regions using rectangular shapes. |
| Circle Annotation | Mark important areas using circular shapes. |

Key capabilities demonstrated in the sample:

Interactive PDF review and collaboration experience.
Real-time annotation creation and modification.
Support for mouse, touch, and pen-based annotation input.
Shape annotations with customizable appearance settings.
Free text comments for document feedback and discussion.
Ink annotation and erasing functionality for handwritten markups.
Seamless integration within the Syncfusion EJ2 PDF Viewer.

## Client — React Frontend

The frontend (`react-app/`) is a React application that:

Loads PDF documents into the Syncfusion EJ2 PDF Viewer.
Provides toolbar options for creating and editing annotations.
Supports text markup annotations such as highlighting.
Enables drawing freehand ink annotations and erasing ink strokes.
Allows adding shape annotations including lines, rectangles, and circles.
Supports Free Text annotations for comments and document feedback.
Includes built-in annotation selection, editing, deleting, printing, and downloading capabilities.
Uses the Material 3 theme via @syncfusion/ej2-material3-theme.

## Architecture
- **react-app/** – React + Syncfusion EJ2 React PDF Viewer components (`App.jsx`, `index.js`)

## Getting Started

### Client

```bash
cd react-pdfviewer-advanced-annotations-ipad-demo
npm install
npm run dev
```
