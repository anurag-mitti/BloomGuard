# BloomGuard: A Multi-Tiered, Scalable Username Availability Checker

BloomGuard is a high-performance back-end service designed to solve a deceptively complex problem: checking for username availability at scale. Inspired by the distributed systems that power tech giants like Uber, this project demonstrates a multi-layered caching strategy using Bloom filters and consistent hashing to protect the database from excessive load, ensuring low latency and high throughput.

---

### The Motivation

Have you ever wondered what happens when you type a username and see that "Username is taken" message? A simple database query seems obvious, but what happens when you have millions of users trying to sign up? Hitting a database for every single character typed in a registration form is incredibly inefficient and expensive.

This project was born from two key insights:
1.  The immense engineering effort behind seemingly simple features, as often seen in tech blogs.
2.  Learning how companies like Uber use techniques like consistent hashing to build scalable, distributed applications.

I wanted to build a system from scratch that could handle this load, even knowing that Redis now offers built-in modules. The goal was to implement the core data structures and architectural patterns myself to deeply understand how they work.

---

### The Problem: Why a Simple DB Query Fails

A naive approach (`SELECT id FROM users WHERE username = ?`) suffers from several critical flaws at scale:

* **High Latency:** Every check requires a network roundtrip to the database.
* **Resource Exhaustion:** The database becomes a bottleneck, as it's busy serving read queries for usernames that don't even exist.
* **High Cost:** Database resources are expensive. Using them for a simple existence check is wasteful.

---

### The Solution: A Multi-Layer Architecture

BloomGuard employs a three-tier defense system to shield the database. A request only proceeds to the next layer if it passes the current one.

<img width="1107" height="402" alt="image" src="https://github.com/user-attachments/assets/cd4eec27-e50e-48ae-ac7e-bafd5bc39a92" />


#### **Layer 1: In-Memory "Hot Set" Bloom Filter**
* **What it is:** A hyper-fast Bloom filter that lives in the server's memory.
* **Purpose:** It stores a "hot set" of the most frequently rejected usernames. This catches common or repeated failed attempts instantly, without any network calls. It's periodically updated from the system's rejection logs.

#### **Layer 2: Persistent Redis Bloom Filter**
* **What it is:** A larger, shared Bloom filter implemented in Redis.
* **Purpose:** Catches usernames that are known to be taken but aren't popular enough to be in the L1 hot set. It's shared across all server instances and is much faster than a full database lookup.

#### **Layer 3: The Database (Final Check)**
* **What it is:** A sharded Redis Hash acting as our main user database.
* **Purpose:** This is the source of truth. A query only hits this layer if a username passes *both* Bloom filters, meaning there's a small chance it might exist (due to the probabilistic nature of Bloom filters). This drastically reduces the number of database reads.

---

### Key Technical Concepts

#### Consistent Hashing
To ensure the system is horizontally scalable, the "database" (our Redis Hashes) is sharded. Instead of a simple modulo approach, this project uses **Consistent Hashing with Virtual Nodes**. This minimizes data reshuffling when nodes are added or removed, a technique critical for large-scale distributed systems.

#### Bloom Filters
A Bloom filter is a probabilistic data structure that is highly space-efficient and can tell you if an element **might be in a set** or **is definitely not in a set**. It can have false positives but never false negatives. This makes it the perfect "guard" for a database.

---

### How to Run This Project

1.  **Prerequisites:**
    * Node.js installed
    * A running Redis instance (with Redis Stack for Bloom Filter commands)

2.  **Installation:**
    ```bash
    git clone [https://github.com/anurag-mitti/BloomGuard.git](https://github.com/anurag-mitti/BloomGuard.git)
    cd BloomGuard
    npm install
    ```

3.  **Run the Server:**
    ```bash
    node server1/index.js
    ```

4.  **Test the Endpoint:**
    Open your browser or Postman and navigate to:
    ```
    http://localhost:3000/check/some-username
    ```
