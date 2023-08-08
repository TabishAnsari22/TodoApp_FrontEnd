import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

function Todo() {
  const [inputVal, steInputVal] = useState("");
  const [eachItem, setEachItem] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [changeBtn, setChangeBtn] = useState(false);
  const [cancleBtn, setCancleBtn] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await axios.get("https://real-ruby-slug-wrap.cyclic.app/api/todos");
      setEachItem(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  const handleEdit = (id: any) => {
    setCancleBtn(true);
    const editItem: any = eachItem.find((item: any) => item._id === id);
    if (editItem) {
      setEditIndex(id);
      steInputVal(editItem.text);
    }
  };

  const handleUpdate = async () => {
    setCancleBtn(false);
    setChangeBtn(true);
    if (editIndex !== null) {
      const updatedItems = eachItem.map((item: any) => {
        if (item._id === editIndex) {
          return { ...item, text: inputVal };
        }
        return item;
      });

      try {
        await axios.put(`https://real-ruby-slug-wrap.cyclic.app/api/todos/${editIndex}`, {
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
    setCancleBtn(false);
    setChangeBtn(false);
    setEditIndex(null);
    steInputVal("");
  };

  const handleClick = async () => {
    try {
      const currentTime = new Date().toLocaleTimeString();
      const itemId = Math.random();

      const response = await axios.post("https://real-ruby-slug-wrap.cyclic.app/api/todos", {
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
      const response = await axios.delete("https://real-ruby-slug-wrap.cyclic.app/api/todos");
      console.log(response.data.message);
      setEachItem([]);
    } catch (error) {
      console.error("Error deleting todos:", error);
    }
  };

  const removeItem = async (textId: any) => {
    try {
      await fetch(`https://real-ruby-slug-wrap.cyclic.app/api/todos/${textId}`, {
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
  const validation = () => {
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
      <div className="flex justify-center">
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && changeBtn == false) {
                validation();
              }
            }}
          />
          <div className="btnContainer">
            {changeBtn == false ? (
              <button className="btn_style12" onClick={validation}>
                <i
                  className="fas fa-circle-plus"
                  style={{ color: "#000000" }}
                ></i>
              </button>
            ) : (
              <div className="flex justify-between">
                <button className="btn_style12">
                  <i
                    className="fas fa-circle-plus"
                    style={{ color: "#000000" }}
                    onClick={handleUpdate}
                  ></i>
                </button>
              </div>
            )}

            <button className="btn_style12">
              {cancleBtn == true ? (
                <i
                  className="fas fa-xmark"
                  style={{ color: "#000000" }}
                  onClick={handleCancelEdit}
                ></i>
              ) : (
                <></>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ textAlign: "center", color: "red", paddingTop: "10px" }}>
          <label>Pleace fill the Data 😊</label>
        </div>
      )}
      <div className="flex justify-center">
        <div className='parent' 
        // className="border w-[30%] mt-4 rounded-3xl bg-[#ffffffb4] opacity-60 pt-[20px] "
        >
          
          {eachItem.map((element: any, ind) => {
            return (
              
              <div key={ind} className="showItems">
                <div className="eachItem">
                  <div className="showItem">
                    <h3 id="item">{element?.text}</h3>
                    <div>
                      <button
                        className="btn_style1"
                        onClick={() => {
                          handleEdit(element._id);
                          setChangeBtn(true);
                        }}
                      >
                        <i className="fas fa-pencil"></i>
                      </button>
                      <button
                        className="btn_style1"
                        onClick={() => {
                          removeItem(element._id);
                        }}
                      >
                        <i
                          className="far fa-trash-alt"
                          style={{ color: "black" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="main_btn">
        <button className="btn_styl" onClick={removeAll}>
          Remove All
        </button>
      </div>
    </>
  );
}
export default Todo;
