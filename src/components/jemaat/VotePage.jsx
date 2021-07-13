import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "./Header";

export default function VotePage() {
  const [data, setData] = useState([]);
  const [totalPenatua, setTotalPenatua] = useState(0);
  const [totalDiaken, setTotalDiaken] = useState(0);
  const [disable, setDisable] = useState(true);
  const [vote, setVote] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "https://my-json-server.typicode.com/JuanBiantong/db_anggota/anggota"
      );
      setData(res.data);
    };
    fetchData();
  }, []);

  const handleCheckbox = (even) => {
    data.map((d, index) => {
      let myCheckbox = document.getElementsByName(`vote${d.id}`);
      if (even.target.name === `vote${d.id}`) {
        if (even.target.checked) {
          if (even.target.id === `penatua${d.id}`) {
            setTotalPenatua(totalPenatua + 1);
            if (totalDiaken > 0 && myCheckbox[1].checked === true) {
              setTotalDiaken(totalDiaken - 1);
            }
          }
          if (even.target.id === `diaken${d.id}`) {
            setTotalDiaken(totalDiaken + 1);
            if (totalPenatua > 0 && myCheckbox[0].checked === true) {
              setTotalPenatua(totalPenatua - 1);
            }
          }
          //pilih salahsatu checkbox tiap row
          myCheckbox.forEach((element) => {
            element.checked = false;
          });
          even.target.checked = true;
        }

        if (!even.target.checked) {
          if (even.target.id === `penatua${d.id}`) {
            if (totalPenatua > 0) {
              setTotalPenatua(totalPenatua - 1);
            }
          }
          if (even.target.id === `diaken${d.id}`) {
            if (totalDiaken > 0) {
              setTotalDiaken(totalDiaken - 1);
            }
          }
        }
      }

      //manipulate data penatua
      if (`penatua${d.id}` === even.target.id) {
        let tmp_array = data;
        if (even.target.value === "penatua" && even.target.checked) {
          tmp_array[index].penatua = 1;
          tmp_array[index].diaken = 0;
          setData(tmp_array);
        } else {
          tmp_array[index].penatua = 0;
          setData(tmp_array);
        }
        if ($(".penatuacheck input:checkbox:checked").length === 5) {
          Swal.fire({
            position: "center",
            icon: "warning",
            html: "<strong>Batas Maksimum Pilihan Penatua</strong>",
            showConfirmButton: true,
            confirmButtonColor: "#ec9e0d"
          });
        }
      }

      //manipulate data diaken
      if (`diaken${d.id}` === even.target.id) {
        let tmp_array = data;
        if (even.target.value === "diaken" && even.target.checked) {
          tmp_array[index].diaken = 1;
          tmp_array[index].penatua = 0;
          setData(tmp_array);
        } else {
          tmp_array[index].diaken = 0;
          setData(tmp_array);
        }
        if ($(".diakencheck input:checkbox:checked").length === 5) {
          Swal.fire({
            position: "center",
            icon: "warning",
            html: "<strong>Batas Maksimum Pilihan Diaken</strong>",
            showConfirmButton: true,
            confirmButtonColor: "#ec9e0d"
          });
        }
      }

      //handle disable checkbox base on maximum length
      if ($(".penatuacheck input:checkbox:checked").length === 5) {
        $(`.penatuacheck input[type=checkbox]:not(:checked)`).attr(
          "disabled",
          true
        );
      } else {
        $(`.penatuacheck input[type=checkbox]`).removeAttr("disabled");
      }
      if ($(".diakencheck input:checkbox:checked").length === 5) {
        $(`.diakencheck input[type=checkbox]:not(:checked)`).attr(
          "disabled",
          true
        );
      } else {
        $(`.diakencheck input[type=checkbox]`).removeAttr("disabled");
      }

      return d;
    });
  };

  const handleDisable = (even) => {
    if (even.target.value === "status" && even.target.checked) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  const handleVote = () => {
    // let tmp_vote = data;
    // for (let i = 0; i < tmp_vote.length; i++) {
    //   if (tmp_vote[i].penatua === 0 && tmp_vote[i].diaken === 0) {
    //     tmp_vote.splice(i, 1);
    //     i--;
    //   }
    // }
    // setVote(tmp_vote);
    let tmp_vote = data.filter(function (el) {
      return el.penatua === 1 || el.diaken === 1;
    });
    setVote(tmp_vote);
  };
  $(document).ready(function () {
    //filter button balon
    $(".sektor").click(function (e) {
      let value = $(this).val();
      $("#myTable tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    //filter button review pilihan
    $(".sektor2").click(function (e) {
      let value = $(this).val();
      $("#myTable2 tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    //filter search ballon
    $("#myInput").on("keyup", function () {
      let value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    //filter search review pilihan
    $("#myInput2").on("keyup", function () {
      let value = $(this).val().toLowerCase();
      $("#myTable2 tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    //tampilkan semua balon
    $(".clear").on("click", function () {
      $("#myTable tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf("") > -1);
      });
    });

    //tampilkan semua review pilihan
    $(".clear2").on("click", function () {
      $("#myTable2 tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf("") > -1);
      });
    });

    //handle checkbox confirmation
    data.map((d) => {
      $(function () {
        $(`.vote`).click(function (e) {
          if ($(this).is(":checked")) {
            $(`.${d.id}vote`).attr("disabled", true);
          } else {
            if (
              $(".penatuacheck input:checkbox:checked").length === 5 ||
              $(".diakencheck input:checkbox:checked").length === 5
            ) {
              $(`.${d.id}vote:checked`).removeAttr("disabled");
            } else {
              $(`.${d.id}vote`).removeAttr("disabled");
            }
          }
        });
      });
      return d;
    });
  });
  return (
    <div className="row justify-content-center w-100 mx-auto">
      <div className="col-md-12 p-0">
        <div className="card border-radius-15">
          <Header />
          <div className="card card-widget widget-user-2 m-0 border-radius-15">
            {/* Add the bg color to the header using any of the bg-* classes */}

            <div className="card-footer bg-light pt-1 pr-2 pl-2 pb-0">
              <ul className="nav flex-column ">
                <li className="nav-item ">
                  <strong className="mr-2 ml-2 p-0 float-right">
                    Total Penatua yang anda pilih{" "}
                    <span className="badge bg-warning m-1">{totalPenatua}</span>{" "}
                    Orang
                  </strong>
                </li>
                <li className="nav-item">
                  <strong className="mr-2 ml-2 p-0 float-right">
                    Total Diaken yang anda pilih{" "}
                    <span className="badge bg-warning m-1">{totalDiaken}</span>{" "}
                    Orang
                  </strong>
                </li>
                <li className="nav-item mx-auto m-1 p-1 m-0 d-flex flex-wrap justify-content-center">
                  <div className="mb-1 p-1 bg-warning mx-auto rounded">
                    <label className="m-0 pl-2 pr-2">
                      Cari berdasarkan sektor
                    </label>
                  </div>
                  <div className="ml-2 mb-1">
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="true"
                      value="1"
                    >
                      1
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="false"
                      value="2"
                    >
                      2
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="false"
                      value="3"
                    >
                      3
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="false"
                      value="4"
                    >
                      4
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="false"
                      value="5"
                    >
                      5
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="false"
                      value="6"
                    >
                      6
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm sektor font-weight-bold"
                      aria-pressed="false"
                      value="7"
                    >
                      7
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm clear font-weight-bold"
                      aria-pressed="false"
                    >
                      Semua
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="row custom m-1 col-md-11 mx-auto justify-content-center pb-3 pr-1 pl-1 bg-cust2">
            <div className="card-header col-md-10 pt-0 pb-0 mt-2 mb-0">
              <h6 className="float-left text-bold text-white">DAFTAR CALON</h6>
              <div className="card-tools">
                <div className="input-group input-group-sm search-width">
                  <input
                    type="text"
                    name="table_search"
                    id="myInput"
                    className="form-control float-right"
                    placeholder="Cari nama calon.."
                  />
                </div>
              </div>
            </div>
            {/* /.card-header */}
            <div className="card-body table-responsive p-0 col-md-10 table-height">
              <table className="table tableFixHead table-bordered table-striped table-xs">
                <thead className="m-0 ">
                  <tr>
                    <th className="p-1 m-0">Nama Lengkap</th>
                    <th className="p-1 m-0">Skt</th>
                    <th className="p-1 m-0 text-center">Jabatan</th>
                  </tr>
                </thead>
                <tbody id="myTable">
                  {data.map((item, i) => {
                    return (
                      <Fragment key={i}>
                        <tr style={{ width: "100%" }}>
                          {/* <td style={{ width: '2%', textAlign: 'center' }}>{item.id}</td> */}
                          <td className="p-1 m-0" style={{ width: "43%" }}>
                            {item.name}
                          </td>
                          <td
                            className="p-1 m-0"
                            style={{ width: "1%", textAlign: "center" }}
                          >
                            {item.sector}
                          </td>
                          <td
                            className="p-1 m-0"
                            style={{
                              width: "56%",
                              alignItems: "center",
                              lineHeight: "100%"
                            }}
                          >
                            <form className="custom2">
                              <div className="penatuacheck">
                                <input
                                  id={`penatua${item.id}`}
                                  type="checkbox"
                                  name={`vote${item.id}`}
                                  onChange={handleCheckbox}
                                  className={`${item.id}vote`}
                                  value="penatua"
                                />
                                <label>&nbsp;Penatua</label>
                              </div>
                              <div className="diakencheck">
                                <input
                                  id={`diaken${item.id}`}
                                  type="checkbox"
                                  name={`vote${item.id}`}
                                  onChange={handleCheckbox}
                                  className={`${item.id}vote`}
                                  value="diaken"
                                />
                                <label>&nbsp;Diaken</label>
                              </div>
                            </form>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-flex mt-2 mb-0 p-1 bg-warning rounded flex-column">
              <button
                className="btn w-50 mx-auto submit-btn p-1 m-0 "
                data-toggle="modal"
                data-target="#myModal"
                onClick={handleVote}
              >
                Tampilkan Pilihan
              </button>
              <label className="m-0 pl-2 pr-2">
                Centang (✓) jika sudah yakin dengan pilihan anda, lalu klik
                Vote!&nbsp;
                <input
                  id="vote"
                  type="checkbox"
                  value="status"
                  onChange={handleDisable}
                  name={`vote`}
                  className="vote"
                />
              </label>
            </div>
            {/* modal */}
            <div
              className="modal fade"
              id="myModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header bg-cust2">
                    <ul className="nav ">
                      <li className="nav-item ">
                        <strong className="mr-2 ml-2 p-0 d-flex text-light">
                          Total Penatua yang anda pilih{" "}
                          <span className="badge bg-warning m-1">
                            {totalPenatua}
                          </span>{" "}
                          Orang
                        </strong>
                        <strong className="mr-2 ml-2 p-0 text-light">
                          Total Penatua yang anda pilih{" "}
                          <span className="badge bg-warning m-1">
                            {totalDiaken}
                          </span>{" "}
                          Orang
                        </strong>
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="btn close bg-danger opacity-5 p-2"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="nav-item mx-auto m-1 p-1 m-0 d-flex flex-wrap justify-content-center">
                    <div className="mb-1 p-1 bg-warning mx-auto rounded">
                      <label className="m-0 pl-2 pr-2">
                        Cari berdasarkan sektor
                      </label>
                    </div>
                    <div className="ml-2 mb-1">
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="true"
                        value="1"
                      >
                        1
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="false"
                        value="2"
                      >
                        2
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="false"
                        value="3"
                      >
                        3
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="false"
                        value="4"
                      >
                        4
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="false"
                        value="5"
                      >
                        5
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="false"
                        value="6"
                      >
                        6
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm sektor2 font-weight-bold"
                        aria-pressed="false"
                        value="7"
                      >
                        7
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm clear2 font-weight-bold"
                        aria-pressed="false"
                      >
                        Semua
                      </button>
                    </div>
                  </div>
                  <div className="modal-body pt-0 pl-1 pr-1">
                    <div className="row custom mr-1 mb-1 ml-1 mt-0 mx-auto justify-content-center pb-3 pt-1 pr-1 pl-1 bg-cust2">
                      <div className="d-flex card-header justify-content-between pt-0 pb-0 mt-2 mb-1">
                        <div className="card-tools">
                          <h6 className="text-bold text-white float-left">
                            Hasil Pilihan
                          </h6>
                        </div>
                        <div className="card-tools w-50">
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              name="table_search"
                              id="myInput2"
                              className="form-control float-right"
                              placeholder="Cari nama calon.."
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body table-responsive p-0 col-md-10 table-height">
                        <table className="table tableFixHead table-bordered table-striped table-xs">
                          <thead className="m-0 ">
                            <tr>
                              <th className="p-1 m-0">Nama Lengkap</th>
                              <th className="p-1 m-0 text-center">Skt</th>
                              <th className="p-1 m-0 text-center">Jabatan</th>
                            </tr>
                          </thead>
                          <tbody id="myTable2">
                            {vote.map((item, i) => {
                              return (
                                <Fragment key={i}>
                                  <tr style={{ width: "100%" }}>
                                    <td className="p-1 m-0">{item.name}</td>
                                    <td className="p-1 m-0 text-center">
                                      {item.sector}
                                    </td>
                                    {item.penatua === 1 ? (
                                      <td className="p-1 m-0 text-center">
                                        Penatua
                                      </td>
                                    ) : item.diaken === 1 ? (
                                      <td className="p-1 m-0 text-center">
                                        Diaken
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                  </tr>
                                </Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="w-25 mx-auto mt-2">
                      <button
                        className="btn submit-btn mx-auto p-1 m-0"
                        data-dismiss="modal"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end of modal */}
          </div>
          <div className="row m-2 justify-content-center">
            <div className="col-sm-2 justify-content-center mx-auto">
              <Link to="/confirmpage">
                <button
                  className="btn submit-btn mx-auto p-1 m-0 justify-content-center"
                  disabled={disable}
                >
                  Vote
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
