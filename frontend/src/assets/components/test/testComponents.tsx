export function TestTableSmall(){
    return (
    <table className="table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Age</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-1">Alice</td>
          <td className="border px-2 py-1">25</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">Bob</td>
          <td className="border px-2 py-1">30</td>
        </tr>
      </tbody>
    </table>
    );
}

export function TestTableMedium(){
    return (
    <table className="table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-1">1</td>
          <td className="border px-2 py-1">Alice</td>
          <td className="border px-2 py-1">alice@example.com</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">2</td>
          <td className="border px-2 py-1">Bob</td>
          <td className="border px-2 py-1">bob@example.com</td>
        </tr>
        <tr>
          <td className="border px-2 py-1">3</td>
          <td className="border px-2 py-1">Charlie</td>
          <td className="border px-2 py-1">charlie@example.com</td>
        </tr>
      </tbody>
    </table>
    );
}

export function TestTableLarge(){
    return (
    <table className="table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Country</th>
          <th className="border px-2 py-1">Phone</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }).map((_, i) => (
          <tr key={i}>
            <td className="border px-2 py-1">{i + 1}</td>
            <td className="border px-2 py-1">User {i + 1}</td>
            <td className="border px-2 py-1">user{i + 1}@example.com</td>
            <td className="border px-2 py-1">Country {i + 1}</td>
            <td className="border px-2 py-1">+123456789{i}</td>
          </tr>
        ))}
      </tbody>
    </table>
    );
}

export function TestParagraph(){
    return (
        <p>Some text content</p>
    );
}