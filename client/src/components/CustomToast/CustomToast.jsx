import classes from "./CustomToast.module.css";

const CustomToast = ({ title, message, isCommercial }) => {
  return (
    <div className={classes.toastContainer}>
      {isCommercial && <div className={classes.commercialLabel}>Communication commerciale ! 🔔</div>}
      <div className={classes.title}>{title}</div>
      <div className={classes.message}>{message}</div>
    </div>
  );
};

export default CustomToast;
