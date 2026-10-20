import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Check, Info } from "lucide-react";

const tables = [
  { id: "T1", seats: 2, type: "Standard", location: "Window Side", status: "available", shape: "round" },
  { id: "T2", seats: 2, type: "Standard", location: "Window Side", status: "available", shape: "round" },
  { id: "T3", seats: 2, type: "Standard", location: "Window Side", status: "available", shape: "round" },
  { id: "T4", seats: 4, type: "Standard", location: "Indoor", status: "available", shape: "round" },
  { id: "T5", seats: 4, type: "Standard", location: "Indoor", status: "booked", shape: "round" },
  { id: "T6", seats: 2, type: "Standard", location: "Window Side", status: "unavailable", shape: "round" },
  { id: "T7", seats: 4, type: "Family", location: "Indoor", status: "unavailable", shape: "square" },
  { id: "T8", seats: 4, type: "Family", location: "Indoor", status: "available", shape: "square" },
  { id: "T9", seats: 4, type: "Family", location: "Indoor", status: "available", shape: "square" },
  { id: "T10", seats: 2, type: "Standard", location: "Outdoor", status: "available", shape: "round" },
  { id: "T11", seats: 2, type: "Standard", location: "Outdoor", status: "unavailable", shape: "round" },
  { id: "T12", seats: 4, type: "Standard", location: "Indoor", status: "available", shape: "round" },
  { id: "T13", seats: 4, type: "Standard", location: "Indoor", status: "available", shape: "round" },
  { id: "T14", seats: 2, type: "Standard", location: "Indoor", status: "unavailable", shape: "round" },
  { id: "T15", seats: 4, type: "Standard", location: "Outdoor", status: "available", shape: "round" }
];

function TableSelector({ guests, onTableSelect }) {
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableClick = (table) => {
    if (table.status !== "available") return;
    if (table.seats < guests) return;

    setSelectedTable(table.id);

    if (onTableSelect) {
      onTableSelect(table);
    }
  };

  return (
    <div className="table-selector">

      <div className="table-map-header">
        <div>
          <span className="table-map-eyebrow">
            AVAILABLE TABLES
          </span>

          <h3>
            Select your preferred table
          </h3>

          <p>
            Click on an available table to select it.
          </p>
        </div>

        <div className="table-map-guests">
          <Users size={17} />
          {guests} {guests === 1 ? "Guest" : "Guests"}
        </div>
      </div>

      {/* Legend */}

      <div className="table-legend">

        <div>
          <span className="legend-circle available" />
          Available
        </div>

        <div>
          <span className="legend-circle selected" />
          Selected
        </div>

        <div>
          <span className="legend-circle booked" />
          Booked
        </div>

        <div>
          <span className="legend-circle unavailable" />
          Unavailable
        </div>

      </div>

      {/* Floor plan */}

      <div className="restaurant-floor-modern">

        <div className="window-zone">
          WINDOW SIDE
        </div>

        <div className="plant plant-one">🌿</div>
        <div className="plant plant-two">🌿</div>
        <div className="plant plant-three">🌿</div>
        <div className="plant plant-four">🌿</div>

        <div className="bar-zone">
          <span>BAR</span>
        </div>

        <div className="service-zone">
          <span>SERVICE</span>
          <span>AREA</span>
        </div>

        <div className="table-layout">

          {tables.map((table, index) => {

            const selected = selectedTable === table.id;
            const booked = table.status === "booked";
            const unavailable =
              table.status === "unavailable";
            const tooSmall =
              table.seats < guests;

            const disabled =
              booked || unavailable || tooSmall;

            return (
              <motion.button
                key={table.id}
                type="button"
                className={`
                  restaurant-table
                  table-position-${index + 1}
                  ${table.shape}
                  ${selected ? "selected" : ""}
                  ${booked ? "booked" : ""}
                  ${unavailable ? "unavailable" : ""}
                  ${tooSmall ? "too-small" : ""}
                `}
                onClick={() => handleTableClick(table)}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.08 } : {}}
                whileTap={!disabled ? { scale: 0.96 } : {}}
              >

                <div className="table-top">

                  {selected ? (
                    <Check size={18} />
                  ) : (
                    <strong>{table.id}</strong>
                  )}

                </div>

                <div className="table-capacity">
                  <Users size={11} />
                  {table.seats}
                </div>

              </motion.button>
            );
          })}

        </div>

        <div className="entrance-zone">
          ENTRANCE
        </div>

      </div>

      {/* Information */}

      <div className="table-hold-note">
        <Info size={16} />

        <span>
          Tables are held for 10 minutes during the booking process.
        </span>
      </div>

    </div>
  );
}

export default TableSelector;