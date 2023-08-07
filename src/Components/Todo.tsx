import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

function Todo() {
  const [inputVal, steInputVal] = useState("");
  const [eachItem, setEachItem] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await axios.get("https://clever-pike-getup.cyclic.app/api/todos");
      setEachItem(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  const handleEdit = (id: any) => {
    const editItem: any = eachItem.find((item: any) => item._id === id);
    if (editItem) {
      setEditIndex(id);
      steInputVal(editItem.text);
    }
  };

  const handleUpdate = async () => {
    if (editIndex !== null) {
      const updatedItems = eachItem.map((item: any) => {
        if (item._id === editIndex) {
          return { ...item, text: inputVal };
        }
        return item;
      });

      try {
        await axios.put(`https://clever-pike-getup.cyclic.app/api/todos/${editIndex}`, {
          text: inputVal,
        });
        setEachItem(updatedItems);
        setEditIndex(null);
        steInputVal("");
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    steInputVal("");
  };

  const handleClick = async () => {
    try {
      const currentTime = new Date().toLocaleTimeString();
      const itemId = Math.random();

      const response = await axios.post("https://clever-pike-getup.cyclic.app/api/todos", {
        text: inputVal,
        textId: itemId,
        time: currentTime,
      });
      setEachItem((prev) => [...prev, response.data]);

      steInputVal("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const removeAll = async () => {
    try {
      const response = await axios.delete("https://clever-pike-getup.cyclic.app/api/todos");
      console.log(response.data.message);
      steInputVal("");
      setEachItem([]);
    } catch (error) {
      console.error("Error deleting todos:", error);
    }
  };

  const removeItem = async (textId: any) => {
    try {
      await fetch(`https://clever-pike-getup.cyclic.app/api/todos/${textId}`, {
        method: "DELETE",
      });
      const remove_item = eachItem.filter((_element: any, ind) => {
        return textId !== _element._id;
      });
      setEachItem(remove_item);
    } catch (err) {
      console.error(err);
    }
  };

  const name: any = useRef(null);
  const useRefe = () => {
    if (!name.current.value) {
      setError(true);
    } else {
      handleClick();
    }
  };
  return (
    <>
      <div className="main_div">
        <Image
          src={"/assets/images/todo1.webp"}
          width={100}
          height={100}
          alt="Picture of the author"
        />
      </div>
      <div className="text_div">
        <h1>
          <i>
            <b>My ToDo App</b>
          </i>
        </h1>
      </div>
      <div className="input_field">
        <input
          type="text"
          placeholder="AddItem"
          onChange={(e) => {
            steInputVal(e.target.value);
            setError(false);
          }}
          autoComplete="off"
          value={inputVal}
          ref={name}
        />
        <div className="btnContainer">
          <button className="btn_style" onClick={useRefe}>
            Add
          </button>
        </div>
      </div>
      {error && (
        <div style={{ textAlign: "center",color:"red",paddingTop:'10px' }}>
          <label>Pleace fill the Data 😊</label>
        </div>
      )}
      {eachItem.map((element: any, ind) => {
        return (
          <div key={ind} className="showItems">
            <div className="eachItem">
              <div className="showItem">
                {editIndex === element._id ? (
                  <input
                    className="border-none outline-none pl-4"
                    type="text"
                    value={inputVal}
                    onChange={(e) => steInputVal(e.target.value)}
                  />
                ) : (
                  <h3 id="item">{element?.text}</h3>
                )}
                <div>
                  {editIndex === element._id ? (
                    <>
                      <button className="btn_style" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="btn_style" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn_style"
                      onClick={() => {
                        removeItem(element._id);
                      }}
                    >
                      X
                    </button>
                  )}
                  <button
                    className="btn_style"
                    onClick={() => {
                      handleEdit(element._id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="main_btn">
        <button className="btn_styl" onClick={removeAll}>
          Remove All
        </button>
      </div>
    </>
  );
}
export default Todo;