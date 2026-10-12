import type { PropRow } from "@/docs/api";

export function PropsTable({ rows, showDefault = true }: { rows: PropRow[]; showDefault?: boolean }) {
  return (
    <div className="table-wrap">
      <table className="props">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            {showDefault && <th scope="col">Default</th>}
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>
                <code className="prop-name">{r.name}</code>
              </td>
              <td>
                <code className="prop-type">{r.type}</code>
              </td>
              {showDefault && <td>{r.default ? <code className="prop-default">{r.default}</code> : <span className="muted">–</span>}</td>}
              <td>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
