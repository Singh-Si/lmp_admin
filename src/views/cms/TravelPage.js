import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import swal from 'sweetalert';
import { Accordion, Col, Row } from 'react-bootstrap';

const TravelPage = () => {
  const navigate = useNavigate();

  const [travelContent, setTravelContent] = useState('')

  const customConfig = {
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
        'indent', 'outdent', '|',
        'blockQuote', '|',
        'undo', 'redo'
      ]
    },
    placeholder: 'Start typing here...'
  };

  useEffect(() => {
    getTravelContent();
  }, []);

  const getTravelContent = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      };

      await fetch('https://lmp.handsintechnology.in/api/getTravelContent', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            setTravelContent(data.data.travelContent);
          } else {
            swal("Error", "Error Fetching Travel Content", "error");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ travelContent })
      };

      const response = await fetch('https://lmp.handsintechnology.in/api/editTravelContent', requestOptions);
      const data = await response.json();

      if (data.status === 200) {
        swal("Success", "Travel Content Updated Successfully", "success");
        // navigate('/cms');
        console.log(data)
      } else {
        swal("Error", "Error Updating Travel Content", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-12">
            <Accordion className="container mb-5">
              <Accordion.Item >
                <Accordion.Header>
                  <div className="card-header new_leads">
                    <strong>Travel Content</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="scrollavcds" style={{ padding: '2px' }}>
                  {/* <div className="card mb-5"> */}
                  <div className='container mt-3'>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className="form-group mb-3">
                          {/* <h3><strong>How To Reach Us</strong></h3> */}
                          <CKEditor
                            editor={ClassicEditor}
                            data={travelContent}
                            config={customConfig}
                            onReady={editor => {
                              // You can store the "editor" and use when it is needed.
                              console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setTravelContent(data);
                            }}
                            onBlur={(event, editor) => {
                              console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                              console.log('Focus.', editor);
                            }}
                          />

                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="card-footer">
            <button className="btn btn-success" style={{ float: "right" }} onClick={handleSubmit}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelPage;