import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Typography, Card, Row, Col, Tag, Menu, Dropdown, Divider } from 'antd';
import { SiBookstack } from "react-icons/si";
import { FaCircleCheck } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { CgSandClock } from "react-icons/cg";
import { BiSolidCategory } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";


const { Text, Title } = Typography;
const { Meta } = Card;

ChartJS.register(ArcElement, Tooltip, Legend);

const DashChart = () => {

  const [chartData, setChartData] = useState(null);
  const [data, setData] = useState({});
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [booksDetails, setBooksDetails] = useState([]);

  const fetchBooks = async () => {
    const res = await axios.get('http://127.0.0.1:5000/books');
    console.log(res.data.books);
    setBooks(res.data.books);
    const processed = processedCategoryData(res.data.books);

    setChartData({
      labels: processed.labels,
      datasets: [
        {
          label: "Available Copies",
          data: processed.data,
          backgroundColor: [
            "#22c55e",
            "#3b82f6",
            "#eab308",
            "#ef4444",
            "#a855f7",
            "#06b6d4",
            "#f97316"
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  const fetchDetails = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/borrow-records');
      setBooksDetails(res.data.request);
      console.log(res.data.request);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchBooks();
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchBooksCount = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/books-count');
        console.log(res.data);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooksCount();
  }, []);
  const processedCategoryData = (books) => {
    const categoryMap = {};

    books.forEach((book) => {
      categoryMap[book.category] =
        (categoryMap[book.category] || 0) + book.available_copies;
    });

    return {
      labels: Object.keys(categoryMap),
      data: Object.values(categoryMap),
    }
  }

  const categories = [...new Set(books.map(b => b.category))];

  const items = [
    {
      key: 'all',
      label: "All"
    },
    ...categories.map(cat => ({
      key: cat,
      label: cat
    }))
  ]
  const total = chartData?.datasets[0].data.reduce((a, b) => a + b, 0) || 0;
  // const total_borrow_book = data.reduce((sum, b)=> sum+b.user._id, 0)
  // console.log(total_borrow_book);

  return (
    <>
      <div style={{
        background: '#FAECE7'
      }}>
        <div>
          <Card style={{background: '#FAECE7'}}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-evenly' }}>
              {[
                {
                  title: "Total Copies", value: data.total_books, icon: <SiBookstack />,
                  bg: "#FEC7B4"
                },
                {
                  title: "Available Copies", value: data.available_books, icon: <FaCircleCheck color='green' />,
                  bg: "#A5DD9B"
                },
                {
                  title: "Pending Requests", value: data.pending_requests, icon: <CiClock2 color='red' />,
                  bg: "#FFE4C9"
                },
                {
                  title: "Approved Requests", value: data.approved_requests, icon: <FiCheckCircle color='green' />,
                  bg: "#C6DCBA"
                },
              ].map((item, index) => (
                <Card key={index} style={{ width: '280px', background: item.bg }} hoverable>
                  <div style={{ fontSize: '17pt' }}>{item.icon}</div>
                  <Text type='secondary'>{item.title}</Text>
                  <Title level={3}>{item.value}</Title>
                </Card>
              ))}
            </div>
          </Card>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <Card hoverable style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px',
            background: '#FFEBD8',
            border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)',
            margin: '20px', height: '350px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <div style={{ width: '400px', height: '250px', margin: '20px 30px' }}>
                {chartData ? (

                  <Pie data={chartData} options={{
                    cutout: '70%', plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true }
                    }
                  }} />

                ) : (
                  <Text>Loading...</Text>
                )}
              </div>
              <div style={{ marginTop: '50px', marginRight: '10px' }}>
                {chartData?.labels.map((label, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: chartData.datasets[0].backgroundColor[index],
                        margin: '5px',
                        borderRadius: '50%'
                      }}></div>
                      <div><Text>{label}</Text></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card style={{
            height: '350px', margin: '20px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px',
            background: '#FFEBD8', backdropFilter: 'blur(12px)', width: '600px'
          }} hoverable title={<Title type='secondary' level={5}>Recent Request</Title>}>
            {booksDetails ? (
              booksDetails.map((b, index) => (
                <div style={{
                  transition: '0.3s',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <Meta title={
                    <div style={{
                      display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                      alignItems: 'center', gap: '100px'
                    }}>
                      <Text style={{
                        textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%'
                      }}>{b.book_name}</Text>
                      <Tag color={b.status === 'Approved' ? 'green' :
                        b.status === 'Pending' ? 'orange' : 'red'
                      } variant='solid'>{b.status}</Tag>
                    </div>
                  } description={
                    <>
                      <Text type='secondary'>Requested by {b.username}</Text>
                    </>
                  } />
                  {index !== booksDetails.length - 1 && <Divider style={{
                    margin: '15px 0px',
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                  }} />}
                </div>
              ))
            ) : (<Text type='secondary'>Laoding...</Text>)}
          </Card>
        </div>
      </div>
      <div style={{background: '#FAECE7'}}>
        <Card>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            margin: '10px 0'
          }}>
            {/* ALL OPTION */}
            <Tag
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: selectedCategory === null ? '#7c3aed' : '#ede9fe',
                color: selectedCategory === null ? 'white' : '#7c3aed',
                border: 'none'
              }}
            >
              All
            </Tag>

            {/* CATEGORY LIST */}
            {categories.map((cat, index) => (
              <Tag
                key={index}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  background: selectedCategory === cat ? '#7c3aed' : '#ede9fe',
                  color: selectedCategory === cat ? 'white' : '#7c3aed',
                  border: 'none'
                }}
              >
                {cat}
              </Tag>
            ))}
          </div>
          <Row>
            <Col style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
              background: '#FAECE7', gap: '20px'
             }}>
              {books.filter(book => !selectedCategory || book.category === selectedCategory)
                .map((b, index) => (
                  <Card key={index}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
                      <img src={b.image} style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'contain'
                    }} /><br />
                    <Text>{b.title}</Text>
                    <Text type='secondary'>Avialable Copies - {b.available_copies}</Text>
                    </div>
                  </Card>
                ))
              }
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default DashChart;