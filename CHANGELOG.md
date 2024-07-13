# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Resident
    - Optional email field for contract resident
    - Document management
        - Link documents to a resident and save them withing the app data
        - Display documents in the document tab of the resident information
        - Include generated contracts to the managed documents
    - Functionality to increase rent 
- Contract
    - Add missing rent information to resident before generation
    - Apply history to resident before generation
    - Display resident email
    - Additional agreements section
    - Signature section
    - House rules attachment
- Validation constraint for currency including 0 €
- Generic `TextInputField` component    

### Changed

- Resident
    - Allow rent deposit of 0 €
    - Made phone number optional

### Fixed

- Allow 0 € as input for `CurrencyInputField`


