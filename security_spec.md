# Security Specification & Threat Model for DSI Employee Portal

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified by that user with `auth.uid == userId`, but the `role` field cannot be elevated to `hr_admin` or `super_admin` by normal users without verified administrative authorization or matching the bootstrapped admin email `mohdiqballakkal@gmail.com`.
2. **Admin Authority Invariant**: Administrative collection `/admins/{userId}` can only be read or written by verified system administrators.
3. **Employee Record Invariant**: The master `/employees/{employeeId}` documents contain sensitive PII (Iqama, Passport, Mobile, Salary/Leave records) and can only be modified by HR/Admin or Super Admin. Employees can only read their own linked employee record (`userId == request.auth.uid`), while HR/Admins and Supervisors can read employee records for operational oversight.
4. **Leave & Vehicle Request Ownership**: Requests in `/leaveRequests` and `/vehicleRequests` must have `userId == request.auth.uid` on creation. Once created, only HR/Admins, Supervisors, or the owner can interact with them.
5. **State Transition Protection**: Non-admins and non-supervisors cannot change the `status` from `pending` to `approved` or `rejected`. Once in a terminal state (`approved` or `rejected`), requests cannot be altered by normal employees.
6. **Vehicle Dispatch Control**: Only HR/Admin or Super Admin can assign `assignedVehicle`, `assignedDriver`, or `driverPhone`.
7. **Announcement Broadcast Authority**: Only HR/Admin or Super Admin can create, modify, or delete `/announcements`. All authenticated employees can read announcements.
8. **Notification Isolation**: A notification at `/notifications/{notificationId}` can only be read, listed, or updated (e.g. `read: true`) by the recipient user (`userId == request.auth.uid`).

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Privilege Escalation on User Profile)**:
   - Target: `POST /users/attacker-uid`
   - Content: `{ "uid": "attacker-uid", "email": "hacker@domain.com", "role": "super_admin" }`
   - Expectation: REJECTED (Role cannot be self-elevated to super_admin).

2. **Payload 2 (Impersonation in Leave Request)**:
   - Target: `POST /leaveRequests/req-evil-1`
   - Content: `{ "requestNumber": "LR-999", "userId": "victim-user-123", "employeeId": "DSI-1001", "leaveType": "Annual", "startDate": "2026-10-01", "endDate": "2026-10-10", "days": 10, "status": "approved" }`
   - Expectation: REJECTED (userId does not match request.auth.uid; status cannot be pre-approved).

3. **Payload 3 (Self-Approval of Vehicle Request)**:
   - Target: `PATCH /vehicleRequests/req-veh-1`
   - Content: `{ "status": "approved", "assignedVehicle": "Toyota Hilux #12" }` by normal employee.
   - Expectation: REJECTED (Only supervisor or admin can approve and assign vehicle).

4. **Payload 4 (Unauthorized PII Document Access)**:
   - Target: `GET /documents/doc-confidential-iqama`
   - Requester: Unrelated employee `emp-456`. Document belongs to `emp-123`.
   - Expectation: REJECTED (PII isolation restricts access to owner or HR/admin).

5. **Payload 5 (Oversized Buffer Injection / Denial of Wallet)**:
   - Target: `POST /announcements/ann-malicious`
   - Content: `{ "title": "...", "content": "A".repeat(500000) }`
   - Expectation: REJECTED (Exceeds maxLength of 2000 characters).

6. **Payload 6 (Shadow Field Injection)**:
   - Target: `PATCH /leaveRequests/req-123`
   - Content: `{ "status": "pending", "isMasterOverride": true, "__debug": "admin" }`
   - Expectation: REJECTED (Strict `affectedKeys()` and schema validation blocks phantom keys).

7. **Payload 7 (Unauthenticated Global Read)**:
   - Target: `GET /employees` without auth credentials.
   - Expectation: REJECTED (Catch-all deny and default rule requires authentication).

8. **Payload 8 (Terminal State Tampering)**:
   - Target: `PATCH /leaveRequests/req-already-approved`
   - Action: User attempts to change `days` or `startDate` after supervisor approval.
   - Expectation: REJECTED (Terminal states cannot be updated by employee).

9. **Payload 9 (Forged Announcement Broadcast)**:
   - Target: `POST /announcements/fake-news`
   - Requester: Regular employee.
   - Content: `{ "title": "Company Holiday Tomorrow", "priority": "urgent" }`
   - Expectation: REJECTED (Only HR/Admin can create announcements).

10. **Payload 10 (Notification Snooping)**:
    - Target: `GET /notifications/notif-for-someone-else`
    - Requester: Employee trying to read manager's approval notices.
    - Expectation: REJECTED (Rule requires `resource.data.userId == request.auth.uid`).

11. **Payload 11 (Admin Registry Injection)**:
    - Target: `POST /admins/attacker-uid`
    - Content: `{ "email": "attacker@evil.com", "role": "super_admin" }`
    - Expectation: REJECTED (Only super admin can add to admin collection).

12. **Payload 12 (Employee Balance Tampering)**:
    - Target: `PATCH /employees/DSI-1002`
    - Content: `{ "annualLeaveBalance": 999 }` by employee themselves.
    - Expectation: REJECTED (Only HR/Admin can modify employee balances and records).
