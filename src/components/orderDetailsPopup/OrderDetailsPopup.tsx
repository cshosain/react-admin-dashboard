import React, { useState, useEffect } from "react";
import "./orderDetailsPopup.scss";
import OrderedItems from "../orderedItems/OrderedItems";

interface OrderDetailsPopupProps {
    open: boolean;
    order: any;
    onClose: () => void;
    onStatusChange: (orderId: string, newStatus: string) => void;
    statusOptions: string[];
}

const MOBILE_WIDTH = 700;

const OrderDetailsPopup: React.FC<OrderDetailsPopupProps> = ({
    open,
    order,
    onClose,
    onStatusChange,
    statusOptions,
}) => {
    const [status, setStatus] = useState(order.status);
    const [show, setShow] = useState(open);
    const [exit, setExit] = useState(false);
    const [showItemDetails, setShowItemDetails] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (open) {
            setShow(true);
            setExit(false);
        }
    }, [open]);

    // Listen for screen resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle close with animation
    const handleClose = () => {
        setExit(true);
        setTimeout(() => {
            setShow(false);
            onClose();
        }, 250); // match fade-out duration
    };

    useEffect(() => {
        setStatus(order.status);
    }, [order.status]);

    if (!show || !order) return null;

    // Get current status index for progress steps
    const currentStatusIndex = statusOptions.indexOf(status);

    return (
        <div className="order-details-popup">
            <div className={`popup-content${exit ? " popup-exit" : ""}`}>
                <button className="close-btn" onClick={handleClose}>
                    &times;
                </button>

                <div className="header-section">
                    <div className="customer-name">
                        {order.shippingInformation?.firstName} {order.shippingInformation?.lastName}
                    </div>
                    <div className="order-number">
                        {new Date(order.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        }).replace(",", " at")}
                    </div>
                </div>

                <div className="section destination-section">
                    {screenWidth <= MOBILE_WIDTH ? (
                        <>
                            <div className="section-header">
                                <h3
                                    className={!showItemDetails ? "active" : ""}
                                    onClick={(event: React.MouseEvent<HTMLHeadingElement>) => {
                                        setShowItemDetails(false);
                                        event.stopPropagation();
                                    }}
                                >
                                    SHIPING DETAILS
                                </h3>
                                <h3
                                    className={showItemDetails ? "active" : ""}
                                    onClick={(event: React.MouseEvent<HTMLHeadingElement>) => {
                                        setShowItemDetails(true);
                                        event.stopPropagation();
                                    }}
                                >
                                    ITEMS DETAILS
                                </h3>
                            </div>
                            {!showItemDetails ? (
                                <table className="customer-meta-table">
                                    <thead>
                                        <tr>
                                            <th>City</th>
                                            <th>Address</th>
                                            <th>Postal Code</th>
                                            <th>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{order.shippingInformation?.city}</td>
                                            <td>{order.shippingInformation?.address}</td>
                                            <td>{order.shippingInformation?.postalCode}</td>
                                            <td>{order.shippingInformation?.phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <OrderedItems order={order} />
                            )}
                        </>
                    ) : (
                        <div className="details-flex">
                            <table className="customer-meta-table">
                                <thead>
                                    <tr>
                                        <th>City</th>
                                        <th>Address</th>
                                        <th>Postal Code</th>
                                        <th>Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{order.shippingInformation?.city}</td>
                                        <td>{order.shippingInformation?.address}</td>
                                        <td>{order.shippingInformation?.postalCode}</td>
                                        <td>{order.shippingInformation?.phone}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <OrderedItems order={order} />
                        </div>
                    )}
                </div>

                <div className="section total-section">
                    <h3>TOTAL (incl. shiping)</h3>
                    <div>${order.totalAmount}</div>
                </div>
                <div className="section total-section">
                    <h3>PAYMENT METHOD: {order.paymentMethod.methodName}</h3>
                    <div>
                        Pay Status:{" "}
                        <span style={{ color: order.paymentMethod.payStatus ? "green" : "red" }}>
                            {order.paymentMethod.payStatus ? "Paid" : "Unpaid"}
                        </span>
                    </div>
                </div>

                <div className="section progress-section">
                    <h3>PROGRESS</h3>
                    <div className="steps">
                        {statusOptions.map((step, index) => (
                            <div
                                key={step}
                                className={`step ${index <= currentStatusIndex ? "active" : ""}`}
                                onClick={() => {
                                    setStatus(step);
                                    onStatusChange(order._id, step);
                                }}
                            >
                                <div className="step-circle"></div>
                                <div className="step-label">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="popup-backdrop" onClick={handleClose}></div>
        </div>
    );
};

export default OrderDetailsPopup;