# Security Specification - Universities Maon

## 1. Data Invariants
- A `Program` cannot exist without a valid `universityId` that refers to an existing `University`.
- `minPercentage` must be between 0 and 100.
- `feePerSemester` must be a positive number.
- `level` must be one of ['BS', 'MPhil', 'MS', 'PhD'].

## 2. The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a university with a forced ID that overlaps with system reserved keywords.
2. **Resource Poisoning**: Sending a 2MB string as university description.
3. **Invalid Level**: Setting program level to "Kindergarten".
4. **Unauthorized Delete**: Anonymous user attempting to delete a university.
5. **Fee Manipulation**: Setting a negative fee (-50000).
6. **Orphaned Program**: Creating a program with a non-existent `universityId`.
7. **Bypassing Admin**: Authenticated non-admin user trying to update a program's `minPercentage`.
8. **Invalid Percentage**: Setting `minPercentage` to 150.
9. **XSS in Description**: Injecting `<script>alert(1)</script>` into university metadata.
10. **State Leak**: Accessing internal system metadata fields if any existed.
11. **Bulk Creation**: Attempting to batch create 100,000 university records.
12. **Field Injection**: Adding `isPromoted: true` to a university when it's not in the schema.

## 3. Test Runner (Draft)
The `firestore.rules` will be tested using the Firestore Emulator. All above payloads must return `PERMISSION_DENIED`.
