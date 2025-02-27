import dinoData from './dinoData';
import dinoStaffData from './dinoStaffData';
import equipmentData from './equipmentData';
import equipStaffData from './equipStaffData';
import rideData from './rideData';
import rideStaffData from './rideStaffData';
import shiftsData from './shiftsData';
import scheduleBuilder from '../../components/schedule/scheduleDomStringBuilders';
import vendorData from './vendorData';
import vendorStaffData from './vendorStaffData';
import staffData from './staffData';

// Smash assignments into collection, ie: rides + rideStaff

const getDinosWithAssignment = () => new Promise((resolve, reject) => {
  dinoData.getDinosaurs().then((allDinos) => {
    dinoStaffData.getDinoStaff().then((assignedDinos) => {
      const allDinosWithAssignment = [];
      allDinos.forEach((dino) => {
        const newDino = { ...dino };
        const assigned = assignedDinos.filter((x) => x.dinoId === newDino.id);
        newDino.assignments = [];
        if (assigned) {
          assigned.forEach((match) => {
            newDino.assignments.push(match);
          });
        }
        allDinosWithAssignment.push(newDino);
      });
      resolve(allDinosWithAssignment);
    });
  }).catch((err) => reject(err));
});

const getEquipmentWithAssignment = () => new Promise((resolve, reject) => {
  equipmentData.getEquipmentData().then((allEquipment) => {
    equipStaffData.getEquipStaff().then((assignedEquipment) => {
      staffData.getStaff().then((allStaff) => {
        const allEquipWithAssignment = [];
        allEquipment.forEach((equipItem) => {
          const newEquipItem = { ...equipItem };
          const assigned = assignedEquipment.find((x) => x.equipmentId === newEquipItem.id);
          if (assigned) {
            newEquipItem.assignment = assigned;
            const findStaffMember = allStaff.find((y) => y.id === assigned.staffId);
            newEquipItem.assignment.staffName = findStaffMember.name;
          } else {
            newEquipItem.assignment = '';
          }
          allEquipWithAssignment.push(newEquipItem);
        });
        resolve(allEquipWithAssignment);
      });
    });
  }).catch((err) => reject(err));
});

const getRidesWithAssignment = () => new Promise((resolve, reject) => {
  rideData.getRides().then((allRides) => {
    rideStaffData.getRideStaff().then((assignedRides) => {
      const allRidesWithAssignment = [];
      allRides.forEach((ride) => {
        const newRide = { ...ride };
        const assigned = assignedRides.filter((x) => x.rideId === newRide.id);
        newRide.assignments = [];
        if (assigned) {
          assigned.forEach((match) => {
            newRide.assignments.push(match);
          });
        }
        allRidesWithAssignment.push(newRide);
      });
      console.log(allRidesWithAssignment);
      resolve(allRidesWithAssignment);
    });
  }).catch((err) => reject(err));
});

const getVendorsWithAssignment = () => new Promise((resolve, reject) => {
  vendorData.getAllVendors().then((allVendors) => {
    vendorStaffData.getVendorStaff().then((assignedVendors) => {
      const allVendorsWithAssignment = [];
      allVendors.forEach((vendor) => {
        const newVendor = { ...vendor };
        const assigned = assignedVendors.filter((x) => x.vendorId === newVendor.id);
        newVendor.assignments = [];
        if (assigned) {
          assigned.forEach((match) => {
            newVendor.assignments.push(match);
          });
        }
        allVendorsWithAssignment.push(newVendor);
      });
      resolve(allVendorsWithAssignment);
    });
  }).catch((err) => reject(err));
});

// Smash assignments & shift into collection, ie: rides + rideStaff + shifts

const findDinoShifts = () => new Promise((resolve, reject) => {
  getDinosWithAssignment().then((dinoAssignments) => {
    shiftsData.getShifts().then((allShifts) => {
      staffData.getStaff().then((staff) => {
        const openDinoShifts = [];
        const takenDinoShifts = [];
        dinoAssignments.forEach((dino) => {
          const newDino = { ...dino };
          const assignedShifts = newDino.assignments;
          allShifts.forEach((shift) => {
            const newShift = { ...shift };
            const matchShift = assignedShifts.filter((x) => x.shiftId === newShift.id);
            if (matchShift[1]) {
              matchShift.forEach((timeMatch) => {
                const findStaff = staff.find((z) => z.id === timeMatch.staffId);
                const storeShift = timeMatch;
                storeShift.shiftDetails = newShift;
                newShift.staffName = findStaff.name;
              });
              takenDinoShifts.push(newDino);
            } else if (matchShift[0]) {
              matchShift.forEach((timeMatch) => {
                const findStaff = staff.find((z) => z.id === timeMatch.staffId);
                const storeShift = timeMatch;
                storeShift.shiftDetails = newShift;
                newShift.staffName = findStaff.name;
              });
              takenDinoShifts.push(newDino);
              newShift.dinoId = newDino.id;
              newShift.dinoName = newDino.name;
              openDinoShifts.push(newShift);
            } else {
              newShift.dinoId = newDino.id;
              newShift.dinoName = newDino.name;
              openDinoShifts.push(newShift);
            }
          });
        });
        const buildString = scheduleBuilder.dinoScheduleBuilder(openDinoShifts, takenDinoShifts);
        resolve(buildString);
      });
    });
  }).catch((err) => reject(err));
});

const findRideShifts = () => new Promise((resolve, reject) => {
  getRidesWithAssignment().then((rideAssignments) => {
    shiftsData.getShifts().then((allShifts) => {
      staffData.getStaff().then((staff) => {
        const openRideShifts = [];
        const takenRideShifts = [];
        rideAssignments.forEach((ride) => {
          if (ride.isOperational === true) {
            const newRide = { ...ride };
            const assignedShifts = newRide.assignments;
            allShifts.forEach((shift) => {
              const newShift = { ...shift };
              const matchShift = assignedShifts.filter((x) => x.shiftId === newShift.id);
              if (matchShift[0]) {
                matchShift.forEach((timeMatch) => {
                  const findStaff = staff.find((z) => z.id === timeMatch.staffId);
                  const storeShift = timeMatch;
                  storeShift.shiftDetails = newShift;
                  newShift.staffName = findStaff.name;
                });
                takenRideShifts.push(newRide);
              } else {
                newShift.rideId = newRide.id;
                newShift.rideName = newRide.name;
                openRideShifts.push(newShift);
              }
            });
          }
        });
        const buildString = scheduleBuilder.rideScheduleBuilder(openRideShifts, takenRideShifts);
        resolve(buildString);
      });
    });
  }).catch((err) => reject(err));
});

const findVendorShifts = () => new Promise((resolve, reject) => {
  getVendorsWithAssignment().then((vendorAssignments) => {
    shiftsData.getShifts().then((allShifts) => {
      staffData.getStaff().then((staff) => {
        const openVendorShifts = [];
        const takenVendorShifts = [];
        vendorAssignments.forEach((vendor) => {
          const newVendor = { ...vendor };
          const assignedShifts = newVendor.assignments;
          allShifts.forEach((shift) => {
            const newShift = { ...shift };
            const matchShift = assignedShifts.filter((x) => x.shiftId === newShift.id);
            if (matchShift[0]) {
              matchShift.forEach((timeMatch) => {
                const findStaff = staff.find((z) => z.id === timeMatch.staffId);
                const storeShift = timeMatch;
                storeShift.shiftDetails = newShift;
                newShift.staffName = findStaff.name;
              });
              takenVendorShifts.push(newVendor);
            } else {
              newShift.vendorId = newVendor.id;
              newShift.vendorName = newVendor.name;
              openVendorShifts.push(newShift);
            }
          });
        });
        const buildString = scheduleBuilder.vendorScheduleBuilder(openVendorShifts, takenVendorShifts);
        resolve(buildString);
      });
    });
  }).catch((err) => reject(err));
});

export default {
  findDinoShifts,
  findRideShifts,
  findVendorShifts,
  getEquipmentWithAssignment,
  getDinosWithAssignment,
  getRidesWithAssignment,
};
