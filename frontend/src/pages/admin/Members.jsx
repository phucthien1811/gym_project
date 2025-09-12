import React from "react";

const mock = [
  { id: "M001", name: "Alex Carter", plan: "Pro", start: "2025-08-10", end: "2025-09-10", status: "Active" },
  { id: "M002", name: "Mia Nguyen", plan: "Basic", start: "2025-08-01", end: "2025-08-31", status: "Expired" },
  { id: "M003", name: "Kenji Park", plan: "Premium", start: "2025-08-20", end: "2025-09-20", status: "Active" },
];

export default function Members() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Members</h2>
        <button className="btn btn--primary btn-md">+ Add Member</button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Plan</th><th>Start</th><th>End</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {mock.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.plan}</td>
                <td>{m.start}</td>
                <td>{m.end}</td>
                <td>
                  <span className={`pill ${m.status === "Active" ? "pill--ok" : "pill--warn"}`}>
                    {m.status}
                  </span>
                </td>
                <td className="admin__row-actions">
                  <button className="link">Edit</button>
                  <button className="link link--danger">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
