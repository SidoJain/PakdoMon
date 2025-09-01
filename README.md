# PakdoMon

**PakdoMon** is a full-stack Pokédex web app built using Express.js, EJS templates, MongoDB, and a custom Pokémon dataset. It enables users to explore detailed data about Pokémon, including their stats, evolutions, types, moves, and abilities.

## Table of Contents

- [How It Works](#how-it-works)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)  
  - [Available Routes](#available-routes)  
  - [Running Locally](#running-locally)  
- [License](#license)  

---

## How It Works

The app connects to a MongoDB database that stores structured Pokémon data. It provides server-rendered pages for listing and searching Pokémon, viewing individual Pokémon stats, browsing types and abilities, and inspecting evolution chains. Key features include:

- Pagination using query offsets  
- Dynamic detail pages rendered via EJS  
- Route-based rendering for Pokémon, types, moves, and abilities  
- Evolution chain lookup with image support  
- Robust error handling for invalid queries  

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Templating Engine:** EJS  
- **Database:** MongoDB + Mongoose  

---

## Getting Started

### Prerequisites

- Node.js (v14 or later)  
- MongoDB database with Pokémon-related collections  
- A `.env` file containing your MongoDB URI

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/SidoJain/PakdoMon.git
cd PakdoMon
npm install
```

---

## Configuration

Create a `.env` file in the root directory and add the following variable:

```env
dbURL=mongodb+srv://<username>:<password>@cluster.mongodb.net/pakdomon
```

Replace the connection string with your actual MongoDB connection URI.

---

## Usage

### Available Routes

| Route                         | Description                                      |
|-------------------------------|--------------------------------------------------|
| `/`                           | Home page                                       |
| `/pokemon`                    | List of Pokémon (20 at a time via `offset`)     |
| `/pokemon/search`             | Search and browse through all Pokémon           |
| `/pokemon/:pokeName`          | Detailed view of a specific Pokémon             |
| `/types`                      | List of all types                               |
| `/ability/:abilityName`       | View Pokémon with a specific ability            |
| `/nature`                     | Static nature page                              |
| Any invalid route             | Shows custom `notFound` page                    |

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
