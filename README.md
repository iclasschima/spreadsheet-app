# Grid Application

This is a Grid application built with React that allows you to create and interact with a spreadsheet-like grid of cells.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

1. Ensure you have [Node.js](https://nodejs.org) installed on your machine.
2. Clone this repository to your local machine using the following command:

```
    git clone https://github.com/iclasschima/spreadsheet-app.git
```
3. Navigate to the project directory and install the dependencies:

```
    npm install
```


## Usage

1. Start the development server:
```
    npm start
```
2. Open your web browser and navigate to `http://localhost:3000` to access the Grid application.
3. Interact with the cells by clicking on them. You can enter values directly or use formulas starting with the "=" sign.
4. The Grid automatically updates the values of dependent cells when you make changes.
5. The application has an auto-save feature that saves the spreadsheet data every 10 seconds.
6. The saving status is displayed at the top-right corner of the Grid, indicating whether the changes are saved or in progress.
7. If the saving process takes longer, a processing status will be displayed until it is completed.

## Features

- Spreadsheet-like grid of cells organized in rows and columns.
- Support for entering values directly into cells or using formulas.
- Formulas can reference other cells using their IDs.
- Automatic update of dependent cells when changes are made.
- Basic error handling with highlighting of rows containing invalid references.
- Auto-save functionality that saves the spreadsheet data every 10 seconds.
- Display of saving and processing statuses to indicate the status of the saving process.
