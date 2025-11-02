# Firestore Basics Guide

A concise guide to understanding Firestore core concepts and operations.

## Core Concepts

### Collection
A **collection** is a container for documents. Collections are similar to tables in SQL databases. They contain multiple documents and are always at **odd levels** in the Firestore hierarchy.

**Example:**
```javascript
collection(db, "users")  // Returns a collection reference
```

### Document
A **document** is a unit of storage that contains fields (key-value pairs). Documents are always at **even levels** in the Firestore hierarchy.

**Example:**
```javascript
doc(db, "users", "g3jkk3kjh3k54")  // Returns a document reference
```

### Reference Types

Firestore uses **references** to point to collections or documents in your database:

- **Collection Reference**: Points to a collection. Created using `collection(db, "collectionName")` or when path has an **odd number of segments**.
  - Example: `"users"` → Collection reference
  
- **Document Reference**: Points to a document. Created using `doc(db, "collectionName", "docId")` or when path has an **even number of segments**.
  - Example: `"users/g3jkk3kjh3k54"` → Document reference
  - Example: `"users/g3jkk3kjh3k54/messages/msg123"` → Document reference (even segments)

**Path Segments Pattern:**
```
"users"                           → 1 segment (odd)  = Collection
"users/abc123"                    → 2 segments (even) = Document
"users/abc123/messages"           → 3 segments (odd)  = Collection
"users/abc123/messages/msg456"   → 4 segments (even) = Document
```

## Firestore Hierarchy Diagram

### Structure Overview

```
Firestore Database
│
├─ Collection (Level 1 - ODD) ════════════════┐
│  └─ Document (Level 2 - EVEN) ═══════════┐ │
│     ├─ Field: name = "John"              │ │
│     ├─ Field: email = "john@example.com" │ │
│     └─ Field: age = 30                   │ │
│                                           │ │
│     └─ Sub-collection (Level 3 - ODD) ┐  │ │
│        └─ Document (Level 4 - EVEN) ┐ │  │ │
│           └─ Field: message = "..." │ │  │ │
│                                      │ │  │ │
└─ Collection (Level 1 - ODD) ════════════┘ │ │
   └─ Document (Level 2 - EVEN) ════════════┘ │
```

### Concrete Example

```
Firestore DB (root)
│
├─ 📁 "users" (Collection - Level 1, ODD)
│  │
│  ├─ 📄 "g3jkk3kjh3k54" (Document - Level 2, EVEN)
│  │  ├─ name: "Alice"
│  │  ├─ email: "alice@example.com"
│  │  └─ 📁 "messages" (Sub-collection - Level 3, ODD)
│  │     ├─ 📄 "msg001" (Document - Level 4, EVEN)
│  │     │  └─ text: "Hello!"
│  │     └─ 📄 "msg002" (Document - Level 4, EVEN)
│  │        └─ text: "How are you?"
│  │
│  └─ 📄 "abc123" (Document - Level 2, EVEN)
│     └─ name: "Bob"
│
└─ 📁 "posts" (Collection - Level 1, ODD)
   └─ 📄 "post001" (Document - Level 2, EVEN)
      └─ title: "My First Post"
```

### Operation Flow Diagram

#### Reading Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     READ OPERATIONS                      │
└─────────────────────────────────────────────────────────┘

Single Document:
  collection() / doc() ───> docRef ───> getDoc() ───> DocumentSnapshot
                                                                 │
                                                                 ├──> .exists() ───> boolean
                                                                 ├──> .data() ───> {fields}
                                                                 └──> .id ───> "documentId"

Multiple Documents:
  collection() ───> collectionRef ───> getDocs() ───> QuerySnapshot
                                                        │
                                                        ├──> .docs[] ───> DocumentSnapshot[]
                                                        ├──> .size ───> number
                                                        └──> .empty ───> boolean

With Query:
  collection() ───> collectionRef ───> query(...constraints) ───> queryRef ───> getDocs() ───> QuerySnapshot
```

#### Writing Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    WRITE OPERATIONS                      │
└─────────────────────────────────────────────────────────┘

Create with Auto ID:
  collection() ───> collectionRef ───> addDoc(data) ───> Promise<DocumentReference>
                                                            │
                                                            └──> New doc with auto-generated ID

Create/Overwrite:
  collection() + doc() ───> docRef ───> setDoc(data) ───> Promise<void>
                                                    │
                                                    └──> Creates or completely replaces document

Update Existing:
  collection() + doc() ───> docRef ───> updateDoc({fields}) ───> Promise<void>
                                                          │
                                                          └──> Updates only specified fields
```

### Reference Type Decision Tree

```
Start with a path string
│
├─ Path contains "/" (multiple segments)?
│  │
│  ├─ Count segments: "users/abc123/messages"
│  │  │
│  │  ├─ Odd count (1, 3, 5...) ───> Use collection() ───> Collection Reference
│  │  │                                   │
│  │  │                                   └──> Use with: getDocs(), addDoc(), query()
│  │  │
│  │  └─ Even count (2, 4, 6...) ───> Use doc() ───> Document Reference
│  │                                        │
│  │                                        └──> Use with: getDoc(), setDoc(), updateDoc()
│  │
│  └─ Single segment: "users"
│     │
│     └─ Always Collection (odd = 1) ───> Use collection() ───> Collection Reference
│                                              │
│                                              └──> Use with: getDocs(), addDoc(), query()
```

### Path Segments Visualization

```
Level 1 (ODD):    📁 Collection
                   │
                   └── Level 2 (EVEN): 📄 Document
                                        │
                                        └── Level 3 (ODD): 📁 Collection
                                                           │
                                                           └── Level 4 (EVEN): 📄 Document
                                                                              │
                                                                              └── Level 5 (ODD): 📁 Collection...

Pattern:
  Level 1: ODD  ───> Collection
  Level 2: EVEN ───> Document
  Level 3: ODD  ───> Collection
  Level 4: EVEN ───> Document
  ...
  
  Rule: ODD levels = Collections, EVEN levels = Documents
```

## Common Operations

### 1. `collection(db, path, ...pathSegments)`
Creates a reference to a collection.

```javascript
const usersRef = collection(db, "users");
```

### 2. `doc(db, path, ...pathSegments)`
Creates a reference to a document.

```javascript
const userDocRef = doc(db, "users", "userId123");
// or
const userDocRef = doc(db, "users/userId123");
```

### 3. `getDoc(docRef)`
Fetches a single document from Firestore. Returns a `DocumentSnapshot`.

```javascript
const docRef = doc(db, "users", "userId123");
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  const data = docSnap.data();
}
```

### 4. `getDocs(collectionRef | queryRef)`
Fetches multiple documents from a collection or query. Returns a `QuerySnapshot`.

```javascript
const usersRef = collection(db, "users");
const querySnap = await getDocs(usersRef);
querySnap.forEach((doc) => {
  console.log(doc.id, doc.data());
});
```

### 5. `query(collectionRef, ...queryConstraints)`
Creates a query to filter, sort, or limit documents. Used with `getDocs()`.

```javascript
const usersRef = collection(db, "users");
const q = query(usersRef, where("age", ">", 18));
const querySnap = await getDocs(q);
```

### 6. `addDoc(collectionRef, data)`
Adds a new document to a collection. Firestore automatically generates a document ID.

```javascript
const usersRef = collection(db, "users");
await addDoc(usersRef, {
  name: "John Doe",
  email: "john@example.com"
});
```

### 7. `setDoc(docRef, data, options?)`
Creates or completely overwrites a document at the specified path. If the document exists, it replaces all fields.

```javascript
const userRef = doc(db, "users", "userId123");
await setDoc(userRef, {
  name: "Jane Doe",
  email: "jane@example.com"
});
```

### 8. `updateDoc(docRef, data)`
Updates specific fields in an existing document without overwriting other fields.

```javascript
const userRef = doc(db, "users", "userId123");
await updateDoc(userRef, {
  email: "newemail@example.com"
});
```

## Handling References

### Determining Reference Type

**Method 1: Check path segments**
- Count path segments separated by "/"
- Odd number of segments = Collection reference
- Even number of segments = Document reference

**Method 2: Use appropriate function**
```javascript
// For collection
const collectionRef = collection(db, "users");

// For document
const docRef = doc(db, "users", "userId123");
```

**Method 3: Dynamic path handling**
```javascript
// If path includes "/", it's likely a document path
if (path.includes("/")) {
  const docRef = doc(db, path);
  const snap = await getDoc(docRef);
} else {
  const collectionRef = collection(db, path);
  const snapshot = await getDocs(collectionRef);
}
```

## Key Differences

| Operation | Use Case | Document ID |
|-----------|----------|-------------|
| `addDoc()` | Create new document | Auto-generated |
| `setDoc()` | Create or overwrite | Specify manually |
| `updateDoc()` | Update existing fields | Must exist |
| `getDoc()` | Get single document | Required |
| `getDocs()` | Get multiple documents | N/A (gets all) |

## Notes

- **Collection paths** always have an odd number of segments
- **Document paths** always have an even number of segments
- Use `getDoc()` for single documents, `getDocs()` for collections
- `setDoc()` completely replaces document data; `updateDoc()` merges fields
- Always check if a document exists using `docSnap.exists()` before accessing data
