import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AboutUs from '../../src/pages/AboutUs/AboutUs';
import introduction from '../../src/pages/AboutUs/text/Introduction';
import { empowerment, transparency, improvement } from '../../src/pages/AboutUs/text/MissionAndValues';
import foundingStory from '../../src/pages/AboutUs/text/FoundingStory';

describe('AboutUs', () => {
  it('renders introduction text', () => {
    render(<AboutUs />);
    expect(screen.getByText('Introduction')).toBeTruthy();
    expect(screen.getByText(introduction)).toBeTruthy();
  });

  it('renders founding story text', () => {
    render(<AboutUs />);
    expect(screen.getByText('Founding Story')).toBeTruthy();
    expect(screen.getByText(foundingStory)).toBeTruthy();
  });

  it('renders mission and values text', () => {
    render(<AboutUs />);
    expect(screen.getByText('Mission and Values')).toBeTruthy();
    expect(screen.getByText('Empowerment and Inclusivity')).toBeTruthy();
    expect(screen.getByText(empowerment)).toBeTruthy();
    expect(screen.getByText('Transparency and Trust')).toBeTruthy();
    expect(screen.getByText(transparency)).toBeTruthy();
    expect(screen.getByText('Continuous Improvement and Innovation')).toBeTruthy();
    expect(screen.getByText(improvement)).toBeTruthy();
  });

  it('renders team section with member images', () => {
    render(<AboutUs />);
    expect(screen.getByText('Team')).toBeTruthy();
    const teamMemberImages = screen.getAllByTestId('team-member-image');
    expect(teamMemberImages.length).toBe(6); // Ensure all team members are rendered
  });

  it('opens modal with member details on image press', () => {
    render(<AboutUs />);
    const teamMemberImages = screen.getAllByTestId('team-member-image');
    fireEvent.press(teamMemberImages[0]);
    expect(screen.getByText('Josefine Mende')).toBeTruthy();
    expect(screen.getByText('4th year Epitech student from Germany')).toBeTruthy();
  });

  it('closes modal on close button press', () => {
    render(<AboutUs />);
    const teamMemberImages = screen.getAllByTestId('team-member-image');
    fireEvent.press(teamMemberImages[0]);
    const closeButton = screen.getByText('Close');
    fireEvent.press(closeButton);
    expect(screen.queryByText('Josefine Mende')).toBeNull();
  });

  it('renders team description text', () => {
    render(<AboutUs />);
    expect(screen.getByText('Meet our passionate and dedicated team who work tirelessly to make our mission a reality.')).toBeTruthy();
  });
});
