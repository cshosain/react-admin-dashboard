type Props = {
    order: any;
}

const OrderedItems = (props: Props) => {
    const { order } = props;
    return (<div className="section items-section">
        <h3>ITEMS</h3>
        <table>
            <thead>
                <tr>
                    <th>PRODUCT-ID</th>
                    <th>ITEM</th>
                    <th>SIZE</th>
                    <th>COLOR</th>
                    <th>PRICE</th>
                    <th>QTY</th>
                </tr>
            </thead>
            <tbody>
                {order.items?.map((item: any) => (
                    <tr key={item._id}>
                        <td>{item.productId.slice(-8)}</td>
                        <td>{item.title}</td>
                        <td>{item.size}</td>
                        <td>{item.color}</td>
                        <td>${item.price}</td>
                        <td>{item.quantity}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}
export default OrderedItems;