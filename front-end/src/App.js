import "./App.module.css";
import students from "../src/student.json";

function App() {
  // var button=document.getElementById("btn")
  // console.log(button);
  function handleData(e) {
    e.preventDefault();
    var form = document.querySelector("form");
    var formData = new FormData(form);
    var data = Object.fromEntries(formData);
    console.log(data);

    if (window.confirm("Are you sure you want to proceed?")) {
      fetch("http://localhost:4080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error("Error:", error));
      console.log("User confirmed the action.");
    } else {
      return;
    }
  }

  return (
    <>
      <form>
        <table>
          <th>S.NO</th>
          <th>NAME</th>
          <th>PRESENT</th>
          <th>ABSENT</th>
          {students.map((student, index) => (
            <tr>
              <td>
                <label for={student.name}>{index + 1}</label>
              </td>
              <td>
                <label for={student.name}>{student.name.toUpperCase()}</label>
              </td>
              <td>
                <input
                  type="radio"
                  name={student.name}
                  value="P"
                  checked
                  title="Present"
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={student.name}
                  value="A"
                  id={student.name}
                  title="Absent"
                />
              </td>
            </tr>
          ))}
        </table>
        <button onClick={handleData}>Submit</button>
      </form>
    </>
  );
}

export default App;
