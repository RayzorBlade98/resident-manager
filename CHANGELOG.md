# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.3.0

### Added

- Rent payments
    - Default value for payment amount in add rent payments form
    - Bank transfer document

### Changed

- Rent payments
    - Hide add rent payment button if payment was already added
- One time incidentals
    - Removed payment from creation form

### Fixed

- UI
    - Date field full width
    - Add water meter reading modal layout

## v0.2.0 - 2024-08-21

### Added

- Property
    - Mandatory field for the rent index url
    - Mandatory field for the rent increase capping limit
- Rent increase
    - Generate notification document on rent increase
- New document types
    - cover letter
    - signed contract
    - signed rent increase

### Changed

- Initialization form
    - Renamed last tab to `Others` instead of `Water costs`
- Documents
    - Splitted document date into creation and subject date
    - Removed generated documents from the uploadable document types

## v0.1.1 - 2024-08-11

### Changed

- Contract
    - Minor adjustments to the template

### Fixed

- Asset handling
    - Required assets are now correctly added to the bundle and handled in code
    - Added stylesheet for contract generation to bundled assets
- Contract
    - Fixed typos
    - Fixed bank information layout
    - Don't display emails as link anymore

## v0.1.0 - 2024-07-13

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
    - Css Stylesheet
- Validation constraint for currency including 0 €
- Generic `TextInputField` component    

### Changed

- Resident
    - Allow rent deposit of 0 €
    - Made phone number optional

### Fixed

- Allow 0 € as input for `CurrencyInputField`
- Correctly display landlord company in contract


