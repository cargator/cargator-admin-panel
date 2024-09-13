import Card from "components/card";
import Loader from "components/loader/loader";
import Navbar from "components/navbar";
import { ActivityAction } from "helper/activity.enum";
import { useEffect, useState } from "react";
import { allExpanded, defaultStyles, JsonView } from "react-json-view-lite";
import { useParams } from "react-router-dom";
import { getActivityData } from "services/customAPI";

const ActivityDetails = () => {
  const id = useParams().id;
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getData = async () => {
    try {
      const respone = await getActivityData({ id: id });
      setActivityData(respone.data[0]);
    } catch (error: any) {
      console.log(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);
  return (
    <div>
      <Navbar />
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-10 p-4 h-full"}>
          {activityData &&
          activityData.action == "UPDATE" &&
          activityData.details.body.beforeUpdate ? (
            <div>
              <p className="my-2 font-bold">Before Update</p>
              <JsonView
                data={{ body: activityData.details.body.beforeUpdate }}
                shouldExpandNode={allExpanded}
                style={defaultStyles}
              />
              <p className="my-2 font-bold">After Update</p>
              <JsonView
                data={{
                  ...activityData,
                  details: {
                    ...activityData.details,
                    body: activityData.details.body.afterUpdate,
                  },
                }}
                shouldExpandNode={allExpanded}
                style={defaultStyles}
              />
            </div>
          ) : (
            <div>
              <JsonView
                data={activityData}
                shouldExpandNode={allExpanded}
                style={defaultStyles}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ActivityDetails;
