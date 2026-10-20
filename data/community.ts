import { MEETING_URL } from './global';
const header = {
  title: 'Community',
  subtitle:
    'We want your feedback, issues, patches, and involvement in the development of Podman. **Chat** with us on Matrix, Discord, IRC, or on our **mailing list**. Submit **issues & pull requests** (see our [CONTRIBUTING guide](https://github.com/containers/podman/blob/main/CONTRIBUTING.md) on how.) Participate in one of our twice-monthly community meetings. You are welcome in our community!',
  image: 'images/optimized/podman-2-196w-172h.webp',
  banner: {
    text: 'To help ensure all feel welcome in the Podman community, we expect all who participate to adhere to our [Code of Conduct](https://github.com/containers/common/blob/main/CODE-OF-CONDUCT.md)',
    icon: 'fa6-regular:handshake',
  },
};

const communityChat = {
  title: 'Chat with the Podman community',
  subtitle:
    'The Podman developers are generally around during CEST and Eastern Time business hours, so please be patient if you’re in another time zone!',
  links: [
    {
      text: '#podman:matrix.org',
      path: 'https://matrix.to/#/#podman:fedoraproject.org',
      image: {
        path: 'logos/optimized/element-56w-59h.webp',
        alt: 'Element Matrix Logo',
      },
    },
    {
      text: '#podman on libera.chat',
      path: 'https://web.libera.chat/#podman-desktop',
      textLogo: 'IRC',
    },
    {
      text: 'Podman GitHub Discussions',
      path: 'https://github.com/containers/podman/discussions',
      image: {
        path: 'vectors/raw/github.svg',
        alt: 'GitHub Logo',
      },
    },
    {
      text: 'Podman Discord',
      path: 'https://discord.gg/vwpj7K6gW5',
      icon: 'logos:discord-icon',
    },
  ],
};

const communityMeetings = {
  title: 'Podman Community Meetings',
  subtitle:
    'Join the Podman maintainers and community to discuss upcoming features, share feedback, or propose topics on the [Mailing List](#mailing-list).',
  image: {
    path: 'images/optimized/community-call-554w-219h.webp',
    alt: 'An image of podman team members in a virtual meeting',
  },
  cards: [
    {
      title: 'Podman Community Meeting',
      subtitle:
        'This meeting is used to show demos for or to have general discussions about Podman or other related container technologies. It is also used to make announcements about Podman and the other projects in the [Containers repository on GitHub](https://github.com/containers).',
      date: '**1st Tuesday** of even numbered months',
      timeZone: '11 AM US ET /5 PM CET',
      buttons: [
        { text: 'Join Meeting', path: MEETING_URL },
        { text: 'Meeting Agenda', path: 'https://hackmd.io/fc1zraYdS0-klJ2KJcfC7w' },
      ],
    },
    {
      title: 'Podman Office Hours',
      subtitle:
        "The Podman project's Office Hours meeting. Join us to discuss issues, the status of the maintainers, do a demo, and ask questions! Here's your chance to connect with the community!",
      date: '**Every Monday & Thursday**',
      timeZone: 'Mon 10:30 AM / Thu 11:30 AM US ET (4:30 / 5:30 PM CET)',
      buttons: [
        { text: 'LFX Calendar', path: 'https://app.lfx.dev/projects/podman-container-tools/calendar' },
        { text: 'Meeting Agenda', path: 'https://hackmd.io/@TomSweeneyRedHat/H1qIC9nkMe' },
      ],
    },
  ],
};

const mailingList = {
  title: 'Mailing List',
  subtitle: 'The Podman Mailing list is available for your questions, concerns or comments about Podman.',
  browseInfo: {
    title: 'Browse the mailing list',
    subtitle:
      'Simply visit [the Podman mailing list website](https://lists.podman.io/) to browse or search previous postings to the Podman mailing list.',
  },
  subscribeInfo: {
    title: 'Subscribe or post to the mailing list',
    subtitle:
      'Simply visit [the Podman mailing list website](https://lists.podman.io/) to browse or search previous postings to the Podman mailing list.',
    description:
      "Regardless of which method you use, a confirmation email will be sent to you. After you reply back to that confirmation email, you'll then be able to send mail directly to podman@lists.podman.io Send an email to [podman-join@lists.podman.io](mailto:podman-join@lists.podman.io). You can then also go to [the web page](https://lists.podman.io) and manage your subscription.",
    options: [
      {
        title: 'Option 1',
        subtitle:
          'Send an email to [podman-join@lists.podman.io](mailto:podman-join@lists.podman.io) with the word "Subscribe" in the subject.',
        button: {
          text: 'Send email',
          path: 'mailto:podman-join@lists.podman.io',
        },
      },
      {
        title: 'Option 2',
        subtitle:
          'Enter your email at the bottom of [the mailing list sign up page](https://lists.podman.io/admin/lists/podman.lists.podman.io/), and hit the "Subscribe" button.',
        button: {
          text: 'Sign up page',
          path: 'https://lists.podman.io/admin/lists/podman.lists.podman.io/',
        },
      },
    ],
  },
  extraInfo: {
    image: {
      path: 'images/optimized/mailing-list-screenshot-580w-376h.webp',
      alt: 'A screenshot of the Podman mailing list home screen.',
    },
    note: {
      title: 'Please note:',
      text: 'If you have a bug that you’d like to report, it’s best to report it here by creating a “New issue” rather than sending an email to the list.',
    },
  },
};

const submittingIssues = [
  {
    title: 'Submitting Issues & Pull Requests',
    subtitle:
      'The following is a quick cheat-sheet of sorts on how to submit issues and pull requests to the Podman project. For the most up-to-date and more comprehensive information, please take a look at  [CONTRIBUTING.md](https://github.com/containers/common/blob/main/CONTRIBUTING.md) in the Podman repo.',
  },
  {
    title: 'Submitting Issues',
    subtitle: "Don't include private / sensitive info in issues!",
    sections: [
      {
        text: '**Before reporting an issue**, [check our backlog of open issues](https://github.com/containers/podman/issues) to see if someone else has already reported it. If so:',
        checkList: [
          'Feel free to add your scenario, or additional information, to the discussion.',
          'Subscribe to the issue to be notified when it is updated.',
        ],
        button: {
          text: 'Check Open Issues',
          links: [
            {
              text: 'Check open Podman issues',
              path: 'https://github.com/containers/podman/issues',
            },
            {
              text: 'Check open Podman Desktop issues',
              path: 'https://github.com/containers/podman-desktop/issues',
            },
            { text: 'Check open Buildah issues', path: 'https://github.com/containers/buildah/issues' },
            { text: 'Check open Skopeo issues', path: 'https://github.com/containers/skopeo/issues' },
            { text: 'Check open Cri-o issues', path: 'https://github.com/cri-o/cri-o/issues' },
          ],
        },
      },
      {
        text: "**If you find a new issue**, we'd love to hear about it! The most important aspect of a bug report is that it includes enough information for us to reproduce it. So, please:",
        checkList: [
          'Include as much detail as possible',
          "Try to remove any extra stuff that doesn't really relate to the issue itself",
        ],
        button: {
          text: 'File a New Issue',
          links: [
            { text: 'File a new Podman issue', path: 'https://github.com/containers/podman/issues/new/choose' },
            {
              text: 'File a new Podman Desktop issue',
              path: 'https://github.com/containers/podman-desktop/issues/new/choose',
            },
            { text: 'File a new Buildah issue', path: 'https://github.com/containers/buildah/issues/new/choose' },
            { text: 'File a new Skopeo issue', path: 'https://github.com/containers/skopeo/issues/new/choose' },
            { text: 'File a new Cri-o issue', path: 'https://github.com/cri-o/cri-o/issues' },
          ],
        },
      },
    ],
  },
  {
    title: 'Submitting Pull Requets',
    subtitle:
      "No Pull Request (PR) is too small! Typos, additional comments in the code, new test cases, bug fixes, new features, more documentation, **...it's all welcome!** ",
    description: [
      'While bug fixes can first be identified via an "issue", that is not required. It\'s ok to just open up a PR with the fix, but make sure you include the same information you would have included in an issue - like how to reproduce it.',
      "PRs for new features should include some background on what use cases the new code is trying to address. When possible and when it makes sense, try to break-up larger PRs into smaller ones - it's easier to review smaller code changes. But only if those smaller ones make sense as stand-alone PRs. Regardless of the type of PR, all PRs should include:",
    ],
    checkList: [
      'Well-documented code changes.',
      'Additional testcases. Ideally, they should fail w/o your code change applied.',
      'Documentation changes.',
    ],
    button: {
      text: 'More PR Submission Details',
      path: 'https://github.com/containers/podman/blob/main/CONTRIBUTING.md#submitting-pull-requests',
    },
  },
];

export { header, communityChat, communityMeetings, mailingList, submittingIssues };
