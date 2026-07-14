import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Typography, Card, Row, Col, Tag, Menu, Dropdown, Divider, Avatar, Button } from 'antd';
import { FiBookOpen, FiUsers } from "react-icons/fi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import '../assets/Main.css';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaHandSparkles } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { CgSandClock } from "react-icons/cg";
import { BiSolidCategory } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";
import '../assets/Banner.css';
import bannerImage from '../assets/Images/banner-image.png';

const { Text, Title } = Typography;
const { Meta } = Card;

ChartJS.register(ArcElement, Tooltip, Legend);

const DashChart = () => {

  const [chartData, setChartData] = useState(null);
  const [user, setUser] = useState([]);
  const [data, setData] = useState({});
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [booksDetails, setBooksDetails] = useState([]);

  const fetchBooks = async () => {
    const res = await axios.get('http://127.0.0.1:5000/books');
    setBooks(res.data.books);
    const processed = processedCategoryData(res.data.books);

    setChartData({
      labels: processed.labels,
      datasets: [
        {
          label: "Available Copies",
          data: processed.data,
          backgroundColor: [
            "#991b1b",
            "#b91c1c",
            "#dc2626",
            "#ef4444",
            "#ef4444",
            "#f87171",
            "#fca5a5",
            "#fecaca"
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

    } catch (err) {
      console.log(err);
    }
  }

  const user_id = localStorage.getItem('b_user_id');

  useEffect(() => {
          const fetchUserProfile = async () => {
              try {
                  const res = await axios.get(`http://127.0.0.1:5000/user-profile/${user_id}`);
                  console.log(res.data.user)
                  setUser(res.data.user)
              } catch (err) {
                  console.log(err);
              }
          }
          fetchUserProfile();
      }, []);

  const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

  useEffect(() => {
    fetchBooks();
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchBooksCount = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/books-count');
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

  const categories = ["All", ...new Set(books.map(b => b.category))];
  console.log(categories);

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
        background: '#2C2C2C'
      }}>
        
          <Card style={{
            // background: '#2C2C2C',
            // borderColor: '#2C2C2C',
            background: '#2C2C2C',
            border:'none',
            overflow: 'hidden'
          }}>
            <div className='dash-banner' style={{

            }}>
              <img src={bannerImage} alt="banner" className='banner-bg'/>

              <div className='banner-content'>
                <Title level={5} style={{color:"#ff4d4f",margin:0}}>Hii, {user.username}!
                  <FaHandSparkles color='#D4AF37' size={20} style={{
                    marginLeft: '5px'
                  }}/>
                </Title>
                <Title level={4} level={1}
                style={{
                    color:"#fff",
                    marginTop:10,
                    marginBottom:15
                }}>Welcome back, {getInitials(user.username)}</Title>
                <Text style={{color:"#BFBFBF", fontSize:17}}>
                    Your library has {data.total_books} books across 6 genres
                </Text>
              </div>
            </div>
          </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center' }}>
          <Card hoverable style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px',
            background: '#232323',
            border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)',
            margin: '20px', height: '400px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <div style={{ width: '400px', height: '250px', margin: '20px 20px' }}>
                {chartData ? (

                  <Pie data={chartData} options={{
                    cutout: '70%', plugins: {
                      legend: { labels: { color: '#BFBFBF' } },
                      tooltip: { enabled: true }
                    }
                  }} />

                ) : (
                  <Text>Loading...</Text>
                )}
              </div>
              <div style={{ marginTop: '50px', marginRight: '20px' }}>
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
                      <div><Text style={{ color: '#BFBFBF' }}>{label}</Text></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card style={{ background: '#232323', borderColor: '#232323', height: '400px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
              {[
                {
                  title: "Total Copies", value: data.total_books, icon: <Avatar icon={<FiBookOpen
                    color='#dc2626' />}
                    shape='circle' size={50} />,
                },
                {
                  title: "Available Copies", value: data.available_books, icon: <Avatar icon={<FiUsers
                    color='#dc2626' />}
                    shape='circle' size={50} />
                },
                {
                  title: "Pending Requests", value: data.pending_requests, icon:
                    <Avatar icon={<HiOutlineClipboardDocumentList
                      color='#dc2626' />}
                      shape='circle' size={50} />
                },
                {
                  title: "Approved Requests", value: data.approved_requests, icon:
                    <Avatar icon={<MdOutlinePendingActions
                      color='#dc2626' />}
                      shape='circle' size={50} />
                },
              ].map((item, index) => (
                <Card key={index} style={{
                  width: '300px', height:'150px' ,margin: '0px', padding: '0px', background: '#232323',
                  borderColor:'#BFBFBF'
                }} hoverable>
                    <div style={{display: 'flex', flexDirection:'column', alignItems:'center',
                      gap: '10px'
                    }}>
                      <div style={{
                      display: 'flex', alignItems: 'center', gap: '20px'
                    }}>
                        <span style={{ fontSize: '17pt' }}>{item.icon}</span>
                        <Title level={4} style={{color:'#BFBFBF'}}>{item.title}</Title>
                      </div>
                      <Title style={{
                        color: '#dc2626'
                      }} level={3}>{item.value}</Title>
                    </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ background: '#2C2C2C' }}>
        {categories.map((cat) => (
          <Tag
            key={cat}
            onClick={() => {
              setSelectedCategory(cat)
            }}
            style={{
              cursor: 'pointer',
              color: selectedCategory === cat ? '#ffffff' : '#d1d5db',
              background: selectedCategory === cat ? '#dc2626' : '#3f3f46',
              fontSize: '13px', borderRadius: '999px', padding: '4px 12px',
              fontWeight: '500px', margin: '20px 10px'
            }}>{cat}</Tag>
        ))}
      </div>
      <div style={{ background: '#2C2C2C' }}>
          <Row>
            <Col style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
              background: '#2C2C2C', gap: '40px',marginTop: '20px'
            }}>
              {books.filter(book => 
              selectedCategory === "All"? true: book.category === selectedCategory)
                .map((b, index) => (
                  <Card key={index}
                    hoverable
                    className='dash-card'
                    style={{
                      width: '220px',
                      borderRadius: '20px',
                      border: '1px solid #fecaca',
                      overflow: 'hidden',
                      background: '#232323',
                      transition: '0.3s',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                      borderColor: '#232323'
                    }}
                    bodyStyle={{
                      padding: '14px'
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        marginBottom: '14px'
                      }}
                    >
                      <img src={b.image} alt={b.book_name}
                        style={{
                          width: '100%',
                          height: '230px',
                          objectFit: 'contain',
                          borderRadius: '14px',
                          background: '#f9fafb'
                        }}
                      />
                      {/* Wishlist icon */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '1px',
                          right: '10px',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: '#fff',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                          cursor: 'pointer'
                        }}
                      >
                        <AiOutlineHeart
                          style={{
                            color: '#f87171',
                            fontSize: '18px'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      margin: '10px'
                    }}>
                      <Title level={5} ellipsis style={{
                        margin: 0,
                        fontSize: '22px',
                        color: '#fff'
                      }}>
                        {b.book_name}
                      </Title>

                      <Text
                        style={{
                          color: '#d1d5db',
                          fontSize: '14px'
                        }}
                      >
                        {b.author}
                      </Text>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap',
                          marginTop: '5px'
                        }}
                      >
                        <Tag
                          style={{
                            borderRadius: '20px',
                            padding: '3px 9px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            fontWeight: '500'
                          }}
                        >
                          {b.category}
                        </Tag>

                        <Tag style={{
                          borderRadius: '12px'
                        }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#22c55e'
                              }}
                            />

                            <Text
                              style={{
                                color: '#16a34a',
                                fontWeight: '500',
                                fontSize: '13px',
                              }}
                            >
                              Available
                            </Text>
                          </div>
                        </Tag>
                      </div>

                      <Tag style={{
                        borderRadius: '12px',
                        marginTop: '15px'
                      }}>
                        <Text
                              style={{
                                color: '#16a34a',
                                fontWeight: '500',
                                fontSize: '13px',
                              }}
                            >
                              {b.available_copies} Available Copies
                            </Text>
                      </Tag>
                    </div>
                  </Card>
                ))
              }
            </Col>
          </Row>
      </div>
    </>
  );
};

export default DashChart;