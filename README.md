# GitHub-Based Configuration Management Portal

## Overview

The objective of this project is to provide a secure and controlled mechanism for managing application configuration changes directly through GitHub.

Instead of manually locating configuration files, updating values, and maintaining change records, users submit configuration change requests through GitHub Issue Forms. These requests are automatically validated, processed, audited, and deployed through a GitHub Actions pipeline.

The solution leverages GitHub as both the user interface and orchestration platform, eliminating the need for additional web applications or management portals.

---

## Architecture

### Frontend

GitHub Issue Forms

### Processing Layer

GitHub Actions

### Validation Layer

DEV → QA → UAT Validation Gates

### Configuration Engine

Node.js Configuration Processing Engine

### Configuration Store

SQLite Database

### Audit Store

Change History Audit Log

### Version Control

Git Commits and GitHub Repository History

---

## High-Level Flow

User

↓

GitHub Issue Form

↓

DEV Validation

↓

QA Validation

↓

UAT Validation

↓

Configuration Processing Engine

↓

SQL Configuration Store Update

↓

Audit Record Generation

↓

Git Commit

↓

Repository History

---

## Repository Structure

```text
.github/
├── ISSUE_TEMPLATE/
│   └── update-config.yml
│
└── workflows/
    └── config-management.yml

engine/
├── process-request.js
├── request-parser.js
├── sql-handler.js
├── json-handler.js
├── csv-handler.js
└── yaml-handler.js

scripts/
├── dev-validation.js
├── qa-validation.js
└── uat-validation.js

database/
└── demo.db

audit/
└── change-history.json
```

---

## Solution Components

### GitHub Issue Form

Users submit configuration change requests using a structured form.

Example:

```text
Application Name: RECON

Section Name: shared_tokens

Configuration Key: PortalEnvironment

New Value: DR

Change Reason: Disaster Recovery Testing
```

The Issue Form acts as the user interface for configuration management.

---

### Request Parser

The request parser extracts values submitted through the GitHub Issue Form and converts them into a structured request object.

Example:

```json
{
  "application": "RECON",
  "section": "shared_tokens",
  "key": "PortalEnvironment",
  "newValue": "DR",
  "reason": "Disaster Recovery Testing"
}
```

This request object is used throughout the pipeline.

---

## Validation Pipeline

### DEV Validation

Purpose:

Validate that the requested configuration exists before any change is performed.

Checks:

* Application exists
* Section exists
* Configuration key exists

Failure Example:

```text
Configuration Not Found
```

---

### QA Validation

Purpose:

Validate that the submitted value is allowed.

Allowed Values:

```text
DEV
QA
UAT
DR
PROD
```

Failure Example:

```text
Invalid Value
```

---

### UAT Validation

Purpose:

Validate business justification for the requested change.

Checks:

* Change reason provided
* Reason meets minimum requirements

Failure Example:

```text
Business Reason Too Short
```

---

## Configuration Processing Engine

Once all validation stages pass, the Configuration Processing Engine executes the requested update.

Current Supported Source:

```text
SQL
```

Future Supported Sources:

```text
JSON
CSV
YAML
XML
```

The engine routes requests to the appropriate handler based on source type.

---

## SQL Configuration Store

Configuration data is stored within a SQLite database.

Example Structure:

```text
Application: RECON
Section: shared_tokens
Key: PortalEnvironment
Value: PROD
```

Example Update:

```text
PortalEnvironment

PROD
↓

DR
```

---

## Audit Trail

Every successful configuration change generates an audit record.

Audit Information:

* Timestamp
* Application
* Section
* Configuration Key
* Previous Value
* New Value
* Status

Example:

```json
{
  "timestamp": "2026-06-03T12:30:00Z",
  "application": "RECON",
  "section": "shared_tokens",
  "key": "PortalEnvironment",
  "oldValue": "PROD",
  "newValue": "DR",
  "status": "SUCCESS"
}
```

---

## Security

The repository remains private.

Access is controlled using native GitHub permissions.

Authorized users can:

* Create change requests
* View request status
* Review deployment history
* Audit configuration changes

No additional authentication system is required.

---

## Benefits

* No external infrastructure
* No dedicated web application
* No separate backend server
* Native GitHub authentication
* Automated validation pipeline
* Full auditability
* Version-controlled changes
* Easy rollback through Git history
* Extensible architecture for multiple configuration sources

---

## Current Workflow Example

1. User submits a configuration change request.
2. GitHub Action is triggered automatically.
3. DEV validation verifies configuration exists.
4. QA validation verifies submitted value.
5. UAT validation verifies business justification.
6. Configuration Processing Engine updates the SQL configuration store.
7. Audit record is generated.
8. Changes are committed back to the repository.
9. Complete history is available through Git and GitHub Actions.

---

## Future Enhancements

* SQL-based audit history table
* Rollback functionality
* Pull Request approval workflow
* Environment-specific approval gates
* Multi-source configuration support
* Bulk configuration updates
* Integration with deployment pipelines
* Dashboard reporting using GitHub Projects