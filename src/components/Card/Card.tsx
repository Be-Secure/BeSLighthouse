// @flow
import * as React from "react";

import cn from "classnames";
import CardHeader from "./CardHeader";
import CardTitle from "./CardTitle";
import CardBody from "./CardBody";
import CardOptions from "./CardOptions";
import CardOptionsItem from "./CardOptionsItem";
import CardStatus from "./CardStatus";
import CardAlert from "./CardAlert";
import CardFooter from "./CardFooter";
import CardMap from "./CardMap";

class Card extends React.PureComponent<any, any> {
  state = {
    isClosed: this.props.isClosed || false,
    isCollapsed: this.props.isCollapsed || false,
    isFullscreen: false,
  };

  static Header = CardHeader;
  static Body = CardBody;
  static Title = CardTitle;
  static Options = CardOptions;
  static OptionsItem = CardOptionsItem;
  static Status = CardStatus;
  static Alert = CardAlert;
  static Footer = CardFooter;
  static Map = CardMap;

  handleCloseOnClick = (): void => {
    this.setState((s: { isClosed: any; }) => ({
      isClosed: !s.isClosed,
    }));
  };

  handleCollapseOnClick = (): void => {
    this.setState((s: { isCollapsed: any; }) => ({
      isCollapsed: !s.isCollapsed,
    }));
  };

  handleFullscreenOnClick = (): void => {
    this.setState((s: { isFullscreen: any; }) => ({
      isFullscreen: !s.isFullscreen,
    }));
  };

  render(): any {
    const {
      className,
      children,
      RootComponent,
      title,
      body,
      options,
      isCollapsible,
      isClosable,
      isFullscreenable,
      aside,
      statusColor,
      statusSide,
      alert,
      alertColor,
      footer,
    } = this.props;
    const { isClosed, isCollapsed, isFullscreen } = this.state;
    if (isClosed) {
      return null;
    }
    const classes = cn(
      {
        card: true,
        aside: aside,
        "card-collapsed": isCollapsed,
        "card-fullscreen": isFullscreen,
      },
      className
    );
    const Component = RootComponent || "div";

    const card_options = (options || isCollapsible || isClosable) && (
      <Card.Options>
        {options}
        {isCollapsible && (
          <Card.OptionsItem
            onClick={this.handleCollapseOnClick}
            type="collapse"
          />
        )}
        {isFullscreenable && (
          <Card.OptionsItem
            type="fullscreen"
            onClick={this.handleFullscreenOnClick}
          />
        )}
        {isClosable && (
          <Card.OptionsItem type="close" onClick={this.handleCloseOnClick} />
        )}
      </Card.Options>
    );

    const card_status = statusColor && (
      <Card.Status color={statusColor} side={statusSide} />
    );

    const card_alert = alert &&
      alertColor && <Card.Alert color={alertColor}>{alert}</Card.Alert>;

    const card_header = title && (
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {card_options}
      </Card.Header>
    );

    const card_body = body && <Card.Body>{body}</Card.Body>;

    const card_footer = footer && <Card.Footer>{footer}</Card.Footer>;

    if (card_header !== null || card_body !== null) {
      return (
        <Component className={classes}>
          {card_status}
          {card_header}
          {card_alert}
          {card_body || children}
          {card_footer}
        </Component>
      );
    } else {
      return <Component className={classes}>{children}</Component>;
    }
  }
}

/** @component */
export default Card;
