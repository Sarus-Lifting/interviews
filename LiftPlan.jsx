import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import Modal from "../../reusable/Modal";
import { toast } from "react-hot-toast";
import { API_URL } from "../../services/api";
import authHeader from "../../services/auth-header";
import { theme } from "../../theme";
import LiftPlanPreview from "../CreateLiftPlan/LiftPlanPreview";
import "./liftplan.styles.scss";

export default function LiftPlan(props) {
  const [planState, setPlanState] = useState({});
  const [sharePlanPopup, setSharePlanPopup] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    const planId = props.match.params.id || props.location?.state?.liftplanId
    if (props.location?.state?.liftplanId) {
      setPlanState(props.location?.state?.planMetaData);
    } else {
      axios
        .get(`${API_URL}/liftplan/plan/${planId}`, {
          headers: authHeader(),
        })
        .then((response) => {
          const { planMetaData } = response.data.data.liftplan;
          setPlanState(planMetaData);
        });
    }
  }, []);

  const sendPlanLinkToEmail = (email) => {
    const emails = email.split(',').map(email=>email.trim())
    const id = props.location?.state?.liftplanId
    if(id){
      const url = `${window.location.origin}/review/liftplan/${id}`
      axios
      .post(
        `${API_URL}/liftplan/send`,
        {
          emails,
          url,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
      }).catch(err=>{
      })
    }
  }

  return (
    <div className="lift-plan-container">
      <i
        className="fa fa-arrow-left medium icon-back"
        onClick={props.history.push("/")}
        style={{ color: theme.light.colors.highlight.primary }}
      ></i>
      <Button
        className = "share-plan-button"
        onClick = { () => setSharePlanPopup(true)}
      >
        Share Lift Plan &nbsp;<i className="fas fa-share medium"></i>
      </Button>
      <div className="lift-plan-content-container">
      <LiftPlanPreview liftplanState={planState} />
      </div>
      <Modal
        show={sharePlanPopup}
        closeButtonStyle={{
          padding: 10,
          cursor: "pointer",
        }}
        modalStyles={{
          width: "100%",
        }}
        handleClose={() => {
          setSharePlanPopup(false);
          setShareEmail("");
          setSelectedId(undefined);
        }}
      >
      <div>
        <center>
          <h1>Share Lift Plan</h1>
        </center>
        <div className="input-field-container">
          <label className="input-label">Add a reviewer</label>
          <div>
            <input
              className="input-email"
              placeholder="Enter Email Address"
              type="text"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="send-email-button">
          <Button
            onClick={() => {
              if (
                shareEmail.length === 0
              ) {
                toast.error(`Email field cannot be empty`);
                return;
              }
              sendPlanLinkToEmail(shareEmail)
              setShareEmail("");
              setSharePlanPopup(false);
              setSelectedId(undefined);
              toast.success(
                `Plan shared successfully!`,
                {
                  position: "top-center",
                }
              );
            }}
          >
            Send Lift Plan &nbsp;<i className="fas fa-share medium"></i>
          </Button>
        </div>
      </div>
    </Modal>
    </div>
  );
}
