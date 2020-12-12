import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PricingCard from '../PricingCard/PricingCard';

import './paidCard.scss';

const PaidCard = ({ active, stripePaymentMonthly, stripePaymentAnnually, userId, viewSignUpModal }) => {
  const [annually, setAnnually] = useState(true);
  return (

    <PricingCard
      cardColor="#980076"
      buttonText={
        // eslint-disable-next-line no-nested-ternary
        userId ? (!active ? 'Upgrade' : '') : 'Sign Up'
      }
      planName={annually ? 'Teacher Annual' : 'Teacher Monthly'}
      planPricing={annually ? '$12/mo' : '$19/mo'}
      planDetails={
        annually ? (
          <div>
            <div className="">
              Billed at $144/year
              <br />
              (you’re saving $84 with an annual plan )
            </div>
            <button
              className="pricing-plan-switch"
              onClick={() => { setAnnually(val => !val); }}
            >
              switch to monthly billing
            </button>
          </div>
        ) : (
          <div>
            <div className="">
              Go annual instead and
              <br />
              save $84 a year
            </div>
            <button
              className="pricing-plan-switch"
              onClick={() => { setAnnually(val => !val); }}
            >
              switch to annual billing
            </button>
          </div>
        )
      }
      onClick={() => {
        if (userId) {
          if (annually) {
            stripePaymentAnnually();
          } else {
            stripePaymentMonthly();
          }
        } else {
          viewSignUpModal();
        }
      }}
      featureList={[
        'Everything in Free Plan',
        'Unlimited students',
        'Unlimited classrooms',
        'Asset hosting with 5GB storage',
      ]}
      backdropColor="rgba(152, 0, 118, 0.2)"
      active={active}
    />
  );
};

PaidCard.propTypes = {
  active: PropTypes.bool,
  stripePaymentMonthly: PropTypes.func.isRequired,
  stripePaymentAnnually: PropTypes.func.isRequired,
  userId: PropTypes.string,
  viewSignUpModal: PropTypes.func.isRequired
};

PaidCard.defaultProps = {
  active: false,
  userId: ''
};

export default PaidCard;
